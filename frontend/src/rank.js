// rank.js

document.addEventListener('DOMContentLoaded', () => {
    const rankListContainer = document.getElementById('rank-list-container');
    const rankMetricFilter = document.getElementById('rank-metric-filter');
    const rankPlatformFilter = document.getElementById('rank-platform-filter');
    const applyRankFiltersButton = document.getElementById('apply-rank-filters');

    let allGames = []; // Para armazenar todos os jogos e filtrar/ordenar

    // Função para renderizar as estrelas (reutilizada de outros scripts)
    function getStarsHtml(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating / 2); // Assume rating é de 0-10 ou similar, convertendo para 0-5 estrelas
        const hasHalfStar = (rating / 2) % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="ri-star-fill"></i>';
        }
        if (hasHalfStar) {
            starsHtml += '<i class="ri-star-half-fill"></i>';
        }
        for (let i = 0; i < (5 - fullStars - (hasHalfStar ? 1 : 0)); i++) {
            starsHtml += '<i class="ri-star-line"></i>';
        }
        return starsHtml;
    }

    // Função para renderizar a lista de ranking
    function renderRankList(gamesToRender) {
        rankListContainer.innerHTML = ''; // Limpa a lista atual

        if (!Array.isArray(gamesToRender) || gamesToRender.length === 0) {
            rankListContainer.innerHTML = '<p style="text-align: center; color: var(--light-gray); padding: 2rem;">Nenhum jogo encontrado para o ranking com os filtros selecionados.</p>';
            return;
        }

        gamesToRender.forEach((game, index) => {
            const rankItem = document.createElement('div');
            rankItem.classList.add('rank-item');
            rankItem.style.animationDelay = `${index * 0.1}s`; // Animação sequencial

            // Adiciona classes para o TOP 3 para estilos especiais
            if (index === 0) rankItem.classList.add('top-1');
            if (index === 1) rankItem.classList.add('top-2');
            if (index === 2) rankItem.classList.add('top-3');

            const optimizedImageUrl = game.background_image
                ? game.background_image.replace('/media/', '/media/resize/400x250/-/') // Ajuste o tamanho conforme necessário
                : 'https://via.placeholder.com/100x60?text=Sem+Imagem';

            const rating = game.rating || game.metacritic || 0;
            const displayRating = (rating / 2).toFixed(1);

            const genre = game.genres && game.genres.length > 0 ? game.genres[0].name : 'N/A';
            const platform = game.platforms && game.platforms.length > 0 ? game.platforms[0].platform.name : 'N/A';

            let scoreDisplay = '';
            const selectedMetric = rankMetricFilter.value;
            if (selectedMetric === 'rating') {
                scoreDisplay = `${displayRating}/5`;
            } else if (selectedMetric === 'popularity') {
                // Simula popularidade com base em metacritic, se disponível
                const popularityScore = game.added || (game.metacritic * 100) || (Math.random() * 10000);
                scoreDisplay = `${popularityScore.toLocaleString('pt-BR')} Votos`; // Ou outro termo como 'Vistas', 'Downloads'
            } else if (selectedMetric === 'added') {
                const addedDate = new Date(game.added);
                scoreDisplay = `${addedDate.toLocaleDateString('pt-BR')}`;
            }

            rankItem.innerHTML = `
                <div class="rank-position">#${index + 1}</div>
                <img src="${optimizedImageUrl}" alt="${game.name}" class="rank-item-image">
                <div class="rank-item-info">
                    <h3>${game.name}</h3>
                    <div class="rank-item-meta">${genre} | ${platform}</div>
                    <div class="rank-item-rating">
                        ${getStarsHtml(rating)}
                        <span>${displayRating}</span>
                    </div>
                </div>
                <div class="rank-score">${scoreDisplay}</div>
            `;
            rankListContainer.appendChild(rankItem);
        });
    }

    // Função para aplicar filtros e ordenar
    function applyRankFilters() {
        const selectedMetric = rankMetricFilter.value;
        const selectedPlatform = rankPlatformFilter.value;

        let filteredGames = allGames.filter(game => {
            const gamePlatforms = game.platforms ? game.platforms.map(p => p.platform.name) : [];
            const matchesPlatform = selectedPlatform === '' || gamePlatforms.includes(selectedPlatform);
            return matchesPlatform;
        });

        // Ordena os jogos com base na métrica selecionada
        filteredGames.sort((a, b) => {
            let valA, valB;
            switch (selectedMetric) {
                case 'rating':
                    valA = a.rating || a.metacritic || 0;
                    valB = b.rating || b.metacritic || 0;
                    break;
                case 'popularity':
                    valA = a.added || (a.metacritic * 100) || (Math.random() * 10000); // Simula popularidade
                    valB = b.added || (b.metacritic * 100) || (Math.random() * 10000);
                    break;
                case 'added': // Mais recentes
                    valA = new Date(a.added);
                    valB = new Date(b.added);
                    break;
                default:
                    valA = a.rating || 0;
                    valB = b.rating || 0;
            }
            return valB - valA; // Ordem decrescente para rating e popularidade
        });

        // Limita ao TOP 10 (ou quantos você quiser)
        const topGames = filteredGames.slice(0, 10);
        renderRankList(topGames);
    }

    // Função para buscar jogos da API
    async function fetchGamesForRanking() {
        try {
            const response = await fetch("http://localhost:8080/api/games/cards"); // Use o endpoint que lista seus jogos
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allGames = data || [];
            applyRankFilters(); // Aplica filtros e ordena inicialmente
        } catch (err) {
            console.error("Erro ao carregar jogos para o ranking:", err);
            rankListContainer.innerHTML = "<p style='text-align: center; color: var(--red); padding: 2rem;'>Erro ao carregar jogos para o ranking. Verifique sua API.</p>";
        }
    }

    // Event Listeners
    applyRankFiltersButton.addEventListener('click', applyRankFilters);
    rankMetricFilter.addEventListener('change', applyRankFilters);
    rankPlatformFilter.addEventListener('change', applyRankFilters);

    // Inicia o carregamento dos jogos
    fetchGamesForRanking();
});