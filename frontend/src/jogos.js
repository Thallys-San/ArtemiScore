// index.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos da Hero Section ---
    const heroTitle = document.querySelector('.hero-title');
    const heroDescription = document.querySelector('.hero-description');
    const heroRatingContainer = document.querySelector('.hero-rating');
    const heroButton = document.querySelector('.hero-button');
    const heroBackground = document.querySelector('.hero-background');

    // --- Elementos da Seção de Jogos Populares ---
    const popularGameListContainer = document.getElementById('popular-game-list');
    const MAX_POPULAR_GAMES = 8;
    const MAX_POPULAR_DESC_LENGTH = 100;

    // Função para renderizar estrelas (reutilizada)
    function getStarsHtml(rating) {
        let starsHtml = '';
        const fullStars = Math.floor(rating / 2); // Divide por 2 se o rating for de 10
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

    // Função para carregar o jogo em destaque
    async function loadFeaturedGame() {
        try {
            const response = await fetch("http://localhost:8080/api/games/cards");
            const games = await response.json();

            if (games && games.length > 0) {
                const featuredGame = games[0]; // Pega o primeiro jogo como destaque

                heroTitle.textContent = featuredGame.name;
                
                let description = featuredGame.description_raw || featuredGame.description || "Sem descrição disponível.";
                description = description.replace(/<[^>]*>/g, "");
                heroDescription.textContent = description.substring(0, 250) + "...";

                const rating = featuredGame.rating || featuredGame.metacritic || 0;
                const displayRating = (rating / 2).toFixed(1);

                heroRatingContainer.innerHTML = `
                    ${getStarsHtml(rating)}
                    <span>${displayRating}/5 (${(Math.random() * 5000 + 1000).toFixed(0)} avaliações)</span>
                `;

                const optimizedImageUrl = featuredGame.background_image
                    ? featuredGame.background_image.replace('/media/', '/media/resize/1920x1080/-/')
                    : 'https://via.placeholder.com/1920x1080?text=Sem+Imagem';
                heroBackground.style.backgroundImage = `url('${optimizedImageUrl}')`;

                // Adiciona a classe para ativar a animação do conteúdo
                // O opacity e transform já estão definidos no CSS com animation: slideInUp
                // heroTitle.parentElement.style.opacity = '1'; 
                // heroTitle.parentElement.style.transform = 'translateY(0)';

                // Ajuste o href do botão de detalhes se tiver uma página de detalhes
                heroButton.href = `detalhes-jogo.html?id=${featuredGame.id}`;

            } else {
                console.warn("Nenhum jogo em destaque encontrado na API.");
                // Opcional: Esconder a hero section ou mostrar mensagem
            }
        } catch (error) {
            console.error("Erro ao carregar jogo em destaque:", error);
            // Opcional: mostrar uma mensagem de erro na UI
        }
    }

    // Função para carregar jogos populares
    async function loadPopularGames() {
        try {
            const response = await fetch("http://localhost:8080/api/games/cards");
            const games = await response.json();

            if (games && games.length > 0) {
                const popularGames = games
                    .sort((a, b) => (b.rating || b.metacritic || 0) - (a.rating || a.metacritic || 0))
                    .slice(0, MAX_POPULAR_GAMES);

                popularGameListContainer.innerHTML = '';

                popularGames.forEach((game, index) => {
                    let description = game.description_raw || game.description || "Sem descrição disponível.";
                    description = description.replace(/<[^>]*>/g, "");
                    if (description.length > MAX_POPULAR_DESC_LENGTH) {
                        description = description.substring(0, MAX_POPULAR_DESC_LENGTH) + "...";
                    }

                    const optimizedImageUrl = game.background_image
                        ? game.background_image.replace('/media/', '/media/resize/400x250/-/')
                        : 'https://via.placeholder.com/400x250?text=Sem+Imagem';

                    const gameCard = document.createElement('div');
                    gameCard.classList.add('game-card');
                    gameCard.style.animationDelay = `${index * 0.08}s`;

                    const rating = game.rating || game.metacritic || 0;
                    const displayRating = (rating / 2).toFixed(1);

                    const genre = game.genres && game.genres.length > 0 ? game.genres[0].name : 'N/A';
                    const platform = game.platforms && game.platforms.length > 0 ? game.platforms[0].platform.name : 'N/A';

                    // --- Estatísticas dos cards (Visualizações, Likes, Comentários) ---
                    const views = (Math.floor(Math.random() * 2000) + 100).toLocaleString('pt-BR');
                    const likes = (Math.floor(Math.random() * 500) + 50).toLocaleString('pt-BR');
                    const comments = (Math.floor(Math.random() * 100) + 10).toLocaleString('pt-BR');

                    gameCard.innerHTML = `
                        <img src="${optimizedImageUrl}" alt="${game.name}" class="game-img">
                        <div class="game-card-content">
                            <h3>${game.name}</h3>
                            <div class="game-meta">
                                <span class="game-genre-platform">${genre} | ${platform}</span>
                            </div>
                            <div class="game-rating">
                                ${getStarsHtml(rating)}
                                <span>${displayRating}</span>
                            </div>
                            <p class="descricao">${description}</p>
                            <a href="detalhes-jogo.html?id=${game.id}" class="btn-details">Ver Detalhes</a>
                        </div>
                        <div class="game-card-stats">
                            <div class="stat-item views">
                                <i class="ri-eye-line"></i> <span>${views}</span>
                            </div>
                            <div class="stat-item likes">
                                <i class="ri-heart-line"></i> <span>${likes}</span>
                            </div>
                            <div class="stat-item comments">
                                <i class="ri-chat-3-line"></i> <span>${comments}</span>
                            </div>
                        </div>
                    `;
                    popularGameListContainer.appendChild(gameCard);
                });
            } else {
                popularGameListContainer.innerHTML = "<p style='text-align: center; color: var(--light-gray); grid-column: 1 / -1;'>Nenhum jogo popular encontrado.</p>";
            }
        } catch (error) {
            console.error("Erro ao carregar jogos populares:", error);
            popularGameListContainer.innerHTML = "<p style='text-align: center; color: var(--red); grid-column: 1 / -1;'>Erro ao carregar jogos populares.</p>";
        }
    }

    // Chamadas para carregar dados se os elementos existirem
    if (heroTitle && heroBackground) {
        loadFeaturedGame();
    }
    if (popularGameListContainer) {
        loadPopularGames();
    }
});