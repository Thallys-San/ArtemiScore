import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";
import "./css/JogosFavoritosPopUp.css";

const JogosFavoritosPopup = ({ isOpen, closeModal }) => {
  const [jogos, setJogos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  // Carregar jogos favoritos ao abrir o popup
  useEffect(() => {
    if (isOpen && token) {
      carregarFavoritos();
      handleSearch();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!token) {
      toast.error("Autenticação necessária");
      return;
    }

    setLoading(true);
    try {
      const termo = searchTerm.trim();
      const url = termo 
        ? `http://localhost:8080/api/games?search=${encodeURIComponent(termo)}`
        : `http://localhost:8080/api/games`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJogos(response.data);
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      toast.error(error.response?.data?.message || "Erro ao buscar jogos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(handleSearch, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const carregarFavoritos = async () => {
    if (!token) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/usuarios/me/favoritos`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavoritos(response.data);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      toast.error(error.response?.data?.message || "Erro ao carregar favoritos");
    }
  };

  const toggleFavorito = async (jogoId) => {
    if (!token) {
      toast.error("Autenticação necessária");
      return;
    }

    try {
      if (favoritos.includes(jogoId)) {
        await axios.delete(
          `http://localhost:8080/api/usuarios/me/favoritos/${jogoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavoritos(favoritos.filter(id => id !== jogoId));
        toast.success("Jogo removido dos favoritos");
      } else {
        if (favoritos.length >= 10) {
          toast.error("Limite de 10 favoritos atingido");
          return;
        }
        await axios.post(
          `http://localhost:8080/api/usuarios/me/favoritos?jogoId=${jogoId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavoritos([...favoritos, jogoId]);
        toast.success("Jogo adicionado aos favoritos");
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      toast.error(error.response?.data?.message || "Erro ao atualizar favoritos");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child as={Fragment} {...transitionProps}>
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} {...transitionProps}>
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                  Adicionar Jogos Favoritos
                </Dialog.Title>
                
                <div className="search-bar mt-4">
                  <input
                    type="text"
                    placeholder="Buscar jogos..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <div className="search-icon" onClick={handleSearch}>
                    <i className="ri-search-line"></i>
                  </div>
                </div>

                {loading ? (
                  <div className="mt-4 text-center">Carregando...</div>
                ) : (
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {jogos.length === 0 ? (
                      <p className="text-gray-400">Nenhum jogo encontrado</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {jogos.map((jogo) => (
                          <div
                            key={jogo.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              favoritos.includes(jogo.id)
                                ? "bg-purple-600"
                                : "bg-gray-700 hover:bg-gray-600"
                            }`}
                            onClick={() => toggleFavorito(jogo.id)}
                          >
                            <div className="flex items-center">
                              <img
                                src={jogo.background_image || DEFAULT_GAME_IMAGE}
                                alt={jogo.name}
                                className="w-12 h-12 rounded mr-3 object-cover"
                              />
                              <div>
                                <h4 className="font-medium text-white">{jogo.name}</h4>
                                <p className="text-sm text-gray-300">
                                  {jogo.genres?.map(g => g.name).join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {favoritos.length}/10 jogos selecionados
                  </span>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none"
                    onClick={closeModal}
                  >
                    Fechar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DEFAULT_GAME_IMAGE = "https://via.placeholder.com/150";
const transitionProps = {
  enter: "ease-out duration-300",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
  leave: "ease-in duration-200",
  leaveFrom: "opacity-100",
  leaveTo: "opacity-0"
};

export default JogosFavoritosPopup;