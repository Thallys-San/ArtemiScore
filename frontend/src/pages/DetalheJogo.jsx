import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MetacriticTemplate from '../components/layout/GameDetails'; // ajuste o caminho se precisar
import HamsterLoading from '../components/commom/HamsterLoading';

const DetalheJogo = () => {
  const { id } = useParams(); // pega o ID da rota /jogos/:id
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Ajuste a URL para a API que você usa, exemplo RAWG:
        const response = await fetch(`http://localhost:8080/api/games/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar detalhes do jogo');

        const data = await response.json();

        // Mapear ou ajustar dados para o formato esperado por MetacriticTemplate
        const mappedData = {
  id: data.id,
  name: data.name,
  background_image: data.background_image,
  description: data.description,
  description_raw: data.description_raw,
  metacriticScore: data.metacritic,
  mediaAvaliacao: data.mediaAvaliacao,
  totalAvaliacoes: data.totalAvaliacoes,
  platforms: data.platforms,
  developers: data.developers,
  publishers: data.publishers,
  genres: data.genres,
  esrb_rating: data.esrb_rating?.name,
  avaliacoes: data.avaliacoes?.map(av => ({
    id: av.id,
    usuario_id: av.usuario_id,
    comentario: av.comentario,
    nota: av.nota,
    dataAvaliacao: av.dataAvaliacao,
    plataforma: av.plataforma,
    tempoDeJogo: av.tempoDeJogo
  })) || [],
  screenshots: data.short_screenshots?.map(s => s.image) || [],
  clip: data.clip,
  released: data.released,
  tags: data.tags,
  stores: data.stores?.map(s => ({
    store: s.store,
    url: s.url,
    price: null
  })),
};


        setGameData(mappedData);
      } catch (err) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) return HamsterLoading;
  if (error) return <p>Erro: {error}</p>;
  if (!gameData) return <p>Jogo não encontrado.</p>;

  return <MetacriticTemplate gameData={gameData} />;
};

export default DetalheJogo;
