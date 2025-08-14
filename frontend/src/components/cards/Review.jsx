// src/components/Review.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
import "./css/Review.css";

const Review = ({ gameData }) => {
  const [usuariosMap, setUsuariosMap] = useState({}); // { id: { nome, foto_perfil, uid } }
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);

  useEffect(() => {
    if (!gameData?.avaliacoes?.length) return;

    const fetchUsuarios = async () => {
      setLoadingUsuarios(true);
      try {
        const ids = [...new Set(gameData.avaliacoes.map(a => a.usuario_id))];

        // Pegar token do Firebase
        const auth = getAuth();
        const user = auth.currentUser;
        let token = null;
        if (user) {
          token = await user.getIdToken();
        }

        const res = await fetch(`http://localhost:8080/api/usuarios?ids=${ids.join(",")}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!res.ok) {
          console.error("Erro ao buscar usuários:", res.status, res.statusText);
          setLoadingUsuarios(false);
          return;
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          console.error("Esperava array de usuários, mas recebeu:", data);
          setLoadingUsuarios(false);
          return;
        }

        const map = {};
        data.forEach(user => {
          map[user.id] = user;
        });
        setUsuariosMap(map);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      } finally {
        setLoadingUsuarios(false);
      }
    };

    fetchUsuarios();
  }, [gameData]);

  return (
    <div className="reviews-section">
      <div className="section-header">
        <h2 className="section-title">Reviews</h2>
        {gameData?.avaliacoes?.length > 0 && (
          <div className="section-summary">
            <span className="review-count">{gameData.avaliacoes.length} Reviews</span>
          </div>
        )}
      </div>

      {gameData?.avaliacoes?.length > 0 ? (
        <>
          <div className="user-reviews-grid">
            {gameData.avaliacoes.slice(0, 3).map((review) => {
              const usuario = usuariosMap[review.usuario_id];

              return (
                <div key={review.id} className="user-review-card">
                  <div className="user-review-header">
                    {loadingUsuarios ? (
                      <span className="user-name">Carregando...</span>
                    ) : usuario ? (
                      <Link to={`/perfil/${usuario.uid}`} className="user-profile-link">
                        <img
                          src={usuario.foto_perfil || "/default-avatar.png"}
                          alt={usuario.nome}
                          className="user-avatar"
                        />
                        <span className="user-name">{usuario.nome}</span>
                      </Link>
                    ) : (
                      <span className="user-name">Usuario {review.usuario_id}</span>
                    )}

                    <div
                      className={`user-score ${
                        review.nota >= 4 ? "positive" : review.nota >= 2.5 ? "mixed" : "negative"
                      }`}
                    >
                      {review.nota}
                    </div>
                    <div className="review-date">
                      {new Date(review.dataAvaliacao).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="user-review-text">{review.comentario}</div>
                </div>
              );
            })}
          </div>

          {gameData.avaliacoes.length > 3 && (
            <button className="view-all-reviews">Ler mais avaliações</button>
          )}
        </>
      ) : (
        <p className="no-reviews-message">Sem Reviews, Seja o primeiro!</p>
      )}
    </div>
  );
};

export default Review;
