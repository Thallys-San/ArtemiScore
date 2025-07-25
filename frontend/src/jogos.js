<<<<<<< HEAD
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
=======
document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM
    const gameList = document.getElementById("game-list");
    const genreFilter = document.getElementById("genre-filter");
    const platformFilter = document.getElementById("platform-filter");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const loadingIndicator = document.getElementById("loading-indicator"); // Adicione um elemento para o indicador de carregamento

    // Variáveis de estado
    let allGames = []; // Para armazenar todos os jogos carregados (ou filtrados)
    let displayedGames = []; // Para armazenar os jogos atualmente exibidos
    let isLoading = false; // Para evitar múltiplas chamadas à API simultaneamente
    let hasMore = true; // Indica se ainda há mais jogos para carregar
    let currentPage = 0; // Usaremos como offset para a API, começando do 0
    const LIMIT_PER_REQUEST = 20; // Quantidade de jogos a carregar por requisição (ajuste conforme sua API)

    // Elemento sentinela para o Intersection Observer
    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    sentinel.style.height = '1px'; // Apenas para ser visível para o observer
    gameList.after(sentinel); // Colocamos o sentinela depois da lista de jogos

    // --- Funções de Carregamento e Renderização ---

    // Função para carregar mais jogos da API
    async function loadMoreGames() {
        if (isLoading || !hasMore) {
            return; // Já está carregando ou não há mais jogos
        }

        isLoading = true;
        loadingIndicator.style.display = 'block'; // Mostra o indicador de carregamento

        try {
            // Adapte a URL da sua API para incluir offset e limit
            // Ex: http://localhost:8080/api/games?offset=0&limit=20
            const response = await fetch(`http://localhost:8080/api/games?offset=${currentPage * LIMIT_PER_REQUEST}&limit=${LIMIT_PER_REQUEST}`);
            if (!response.ok) throw new Error('Erro ao carregar jogos');

            const newGames = await response.json();
            
            if (newGames.length === 0) {
                hasMore = false; // Não há mais jogos para carregar
                sentinel.style.display = 'none'; // Esconde o sentinela
            } else {
                allGames = allGames.concat(newGames); // Adiciona os novos jogos à lista total
                currentPage++;
                renderGames(newGames, true); // Renderiza apenas os novos jogos
            }

        } catch (error) {
            console.error("Erro ao carregar mais jogos:", error);
            if (gameList.children.length === 0) { // Se não houver nenhum jogo ainda
                gameList.innerHTML = `
                    <div class="error-message">
                        <i class="ri-error-warning-line"></i>
                        <p>Não foi possível carregar os jogos. Tente novamente mais tarde.</p>
                    </div>
                `;
            }
        } finally {
            isLoading = false;
            loadingIndicator.style.display = 'none'; // Esconde o indicador de carregamento
        }
    }

    // Função para renderizar os jogos
    // O parâmetro 'append' indica se devemos adicionar os jogos ou substituir a lista
    function renderGames(games, append = false) {
        if (!append) {
            gameList.innerHTML = ''; // Limpa a lista se não for para adicionar
            displayedGames = [];
        }

        if (!games || games.length === 0) {
            if (!append && gameList.children.length === 0) { // Se não houver jogos e não estiver adicionando
                gameList.innerHTML = '<div class="no-results">Nenhum jogo encontrado com os filtros selecionados.</div>';
            }
            return;
        }

        games.forEach(game => {
            const gameCard = createGameCard(game);
            gameList.appendChild(gameCard);
            displayedGames.push(game); // Adiciona ao array de jogos exibidos
        });
    }

    // Função para criar um card de jogo (sem alterações aqui)
    function createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';

        const description = game.description
            ? game.description.substring(0, 100) + (game.description.length > 100 ? '...' : '')
            : 'Descrição não disponível';

        const platforms = Array.isArray(game.platforms)
            ? game.platforms.map(p => typeof p === 'string' ? p : p.name).join(', ')
            : 'Plataformas não especificadas';

        const genres = Array.isArray(game.genres)
            ? game.genres.map(g => typeof g === 'string' ? g : g.name).join(', ')
            : 'Gênero não especificado';

        const rating = game.rating ?? game.mediaAvaliacao ?? 0;
        const ratingPercent = rating > 5 ? rating : rating * 20;

        card.innerHTML = `
            <div class="game-card-inner">
                <div class="game-image">
                    <img src="${game.background_image || './assets/images/sem-imagem.jpg'}" alt="${game.name}">
                    <div class="game-rating" style="--rating: ${ratingPercent}%">
                        ${rating.toFixed(1)}
                    </div>
                </div>
                <div class="game-info">
                    <h3 class="game-title">${game.name}</h3>
                    <div class="game-meta">
                        <span class="game-platforms" title="${platforms}">
                            <i class="ri-computer-line"></i> ${platforms.split(',')[0] || 'N/A'}
                        </span>
                        <span class="game-genre" title="${genres}">
                            <i class="ri-price-tag-3-line"></i> ${genres.split(',')[0] || 'N/A'}
                        </span>
                    </div>
                    <p class="game-description">${description}</p>
                    <div class="game-actions">
                        <button class="btn-details">
                            <i class="ri-information-line"></i> Detalhes
                        </button>
                        <button class="btn-wishlist">
                            <i class="ri-heart-line"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        card.querySelector('.btn-details').addEventListener('click', () => {
            window.location.href = `detalhes.html?id=${game.id}`;
        });

        return card;
    }

    // Função para filtrar jogos (aplicará os filtros nos jogos já carregados)
    function filterGames() {
        const selectedGenre = genreFilter.value;
        const selectedPlatform = platformFilter.value.toLowerCase();

        let filtered = [...allGames]; // Filtra todos os jogos carregados até o momento

        if (selectedGenre) {
            filtered = filtered.filter(game => {
                const gameGenres = Array.isArray(game.genres)
                    ? game.genres.map(g => typeof g === 'string' ? g : g.name)
                    : [];
                return gameGenres.some(genre => genre.toLowerCase().includes(selectedGenre.toLowerCase()));
            });
        }

        if (selectedPlatform) {
            filtered = filtered.filter(game => {
                const gamePlatforms = Array.isArray(game.platforms)
                    ? game.platforms.map(p => typeof p === 'string' ? p : p.name)
                    : [];
                return gamePlatforms.some(platform =>
                    platform.toLowerCase().includes(selectedPlatform)
                );
            });
        }
        
        // Renderiza os jogos filtrados, substituindo a lista atual
        renderGames(filtered, false);
    }

    // --- Intersection Observer para Scroll Infinito ---
    const observer = new IntersectionObserver((entries) => {
        // Se o sentinela estiver visível e não estivermos carregando
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            loadMoreGames();
        }
    }, {
        root: null, // Observa a viewport
        rootMargin: '0px', // Distância da borda da viewport
        threshold: 0.1 // 10% do sentinela visível para disparar
    });

    // Observa o sentinela
    observer.observe(sentinel);

    // --- Event Listeners ---
    applyFiltersBtn.addEventListener('click', filterGames);

    // --- Inicialização ---
    // Na inicialização, a primeira carga será feita pelo Intersection Observer quando a página for carregada
    // e o sentinela estiver visível.
});
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
