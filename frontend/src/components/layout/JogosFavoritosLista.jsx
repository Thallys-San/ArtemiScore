import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/JogosFavoritosLista.css';
import GameCard from '../cards/GameCard'; 

const JogosFavoritosLista = ({ jogosIds, token }) => {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJogos = async () => {
      if (!jogosIds || jogosIds.length === 0) {
        setJogos([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Faz requisições individuais para cada jogo
        const jogosPromises = jogosIds.map(id => 
          axios.get(`http://localhost:8080/api/games/${id}`, {
            headers: { 
              Authorization: `Bearer ${token}`
            }
          }).then(res => res.data)
          .catch(err => {
            console.error(`Erro ao buscar jogo ${id}:`, err);
            return null;
          })
        );

        const jogosResultados = await Promise.all(jogosPromises);
        const jogosValidos = jogosResultados.filter(jogo => jogo !== null);
        
        // Adiciona mediaAvaliacao se necessário (ajuste conforme seu backend)
        const jogosComAvaliacao = jogosValidos.map(jogo => ({
          ...jogo,
          mediaAvaliacao: jogo.mediaAvaliacao || 0 // Valor padrão ou ajuste conforme sua lógica
        }));
        
        setJogos(jogosComAvaliacao);
      } catch (err) {
        console.error('Erro ao buscar jogos favoritos:', err);
        setError('Erro ao carregar jogos favoritos');
        setJogos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJogos();
  }, [jogosIds, token]);

  if (loading) {
    return (
      <div className="loading-container-small">
        <span>Carregando jogos favoritos...</span>
      </div>
    );
  }

  if (error) {
    return <div className="error-message-small">{error}</div>;
  }

  if (!jogos || jogos.length === 0) {
    return <p className="sem-conteudo">Nenhum jogo favorito adicionado.</p>;
  }

  return (
    <div className="jogos-favoritos-grid game-card-container">
      {jogos.map(jogo => (
        <GameCard key={jogo.id} jogo={jogo} />
      ))}
    </div>
  );
};

export default JogosFavoritosLista;
