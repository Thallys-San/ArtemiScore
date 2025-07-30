
document.addEventListener("DOMContentLoaded", () => {
    const gameList = document.getElementById("game-list");
    const genreFilter = document.getElementById("genre-filter");
    const platformFilter = document.getElementById("platform-filter");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const loadingIndicator = document.getElementById("loading-indicator");

    let allGames = [];
    let displayedGames = [];
    let isLoading = false;
    let hasMore = true;
    let currentPage = 0;
    let firstLoad = true;
    const LIMIT_PER_REQUEST = 20;

    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    sentinel.style.height = '1px';
    gameList.after(sentinel);

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
            loadMoreGames();
        }
    }, {
        root: null,
        rootMargin: '200px',
        threshold: 0.01
    });

    observer.observe(sentinel);

    async function loadMoreGames() {
        if (isLoading || !hasMore) return;

        isLoading = true;
        loadingIndicator.style.display = 'block';

        try {
            let offset = currentPage * LIMIT_PER_REQUEST;
            let url = `http://localhost:8080/api/games?offset=${offset}&limit=${LIMIT_PER_REQUEST}`;

            console.log("Fetching URL:", url);
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erro ao carregar jogos");

            const newGames = await response.json();

            console.log("Jogos carregados:", newGames.length);

            if (!newGames || newGames.length === 0) {
                hasMore = false;
                observer.unobserve(sentinel); // <- Melhor do que .style.display = "none"
            } else {
                allGames = allGames.concat(newGames);
                currentPage++;
                renderGames(newGames, true);
            }

            firstLoad = false;
        } catch (error) {
            console.error("Erro ao carregar mais jogos:", error);
        } finally {
            isLoading = false;
            loadingIndicator.style.display = "none";
        }
    }

    function renderGames(games, append = false) {
        if (!append) {
            gameList.innerHTML = '';
            displayedGames = [];
        }

        if (!games || games.length === 0) {
            if (!append && gameList.children.length === 0) {
                gameList.innerHTML = '<div class="no-results">Nenhum jogo encontrado com os filtros selecionados.</div>';
            }
            return;
        }

        games.forEach(game => {
            const gameCard = createGameCard(game);
            gameList.appendChild(gameCard);
            displayedGames.push(game);
        });
    }

    function renderEstrelas(nota, containerId, scoreId) {
        const container = document.getElementById(containerId);
        const score = document.getElementById(scoreId);

        if (!container || !score) return;

        container.innerHTML = '';
        score.textContent = `${nota.toFixed(1)}/5`;

        const full = Math.floor(nota);
        const half = nota % 1 >= 0.25 && nota % 1 <= 0.75;
        const empty = 5 - full - (half ? 1 : 0);

        const starStyle = 'color: #FDB813; font-size: 18px; margin-right: 2px;';
        const emptyStarStyle = 'color: #DDD; font-size: 18px; margin-right: 2px;';

        for (let i = 0; i < full; i++) {
            const icon = document.createElement('i');
            icon.className = 'ri-star-fill';
            icon.style.cssText = starStyle;
            container.appendChild(icon);
        }

        if (half) {
            const icon = document.createElement('i');
            icon.className = 'ri-star-half-fill';
            icon.style.cssText = starStyle;
            container.appendChild(icon);
        }

        for (let i = 0; i < empty; i++) {
            const icon = document.createElement('i');
            icon.className = 'ri-star-line';
            icon.style.cssText = emptyStarStyle;
            container.appendChild(icon);
        }
    }

    function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const plataformas = Array.isArray(game.platforms)
        ? game.platforms.map(p => typeof p === 'string' ? p : p.name).join(', ')
        : 'Plataforma desconhecida';

    const generos = Array.isArray(game.genres)
        ? game.genres.map(g => typeof g === 'string' ? g : g.name).join(', ')
        : 'Gênero não especificado';

    const nota = game.rating ?? game.mediaAvaliacao ?? 0;
    const imagem = game.background_image || './assets/images/sem-imagem.jpg';

    const starsId = `stars-${game.id}`;
    const scoreId = `score-${game.id}`;

    card.innerHTML = `
        <div class="game-image-container">
            <img class="game-img" src="${imagem}" alt="${game.name}">
            <span class="game-genre">${generos.split(',')[0]}</span>
            ${nota > 0 ? `
                <div class="quick-rate">
                    <div class="quick-rate-content">
                        <span class="quick-rate-label">Avaliação</span>
                        <div class="stars" id="${starsId}"></div>
                        <span class="score" id="${scoreId}"></span>
                    </div>
                </div>
            ` : ''}
        </div>
        <div class="game-content">
            <h3 class="game-title">${game.name}</h3>
            <div class="game-meta">
                <span title="${plataformas}">
                    <i class="ri-computer-line"></i> ${plataformas.split(',')[0]}
                </span>
                <span title="${generos}">
                    <i class="ri-price-tag-3-line"></i> ${generos.split(',')[0]}
                </span>
            </div>
        </div>
    `;

    if (nota > 0) {
        setTimeout(() => renderEstrelas(nota, starsId, scoreId), 0);
    }

    return card;
}



    function filterGames() {
        const selectedGenre = genreFilter.value;
        const selectedPlatform = platformFilter.value.toLowerCase();

        let filtered = [...allGames];

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

        renderGames(filtered, false);

        // 🔄 Reconectar observer se for necessário
        if (filtered.length > 0 && !hasMore) {
            hasMore = true;
            observer.observe(sentinel);
        }
    }

    applyFiltersBtn.addEventListener('click', filterGames);

    // Inicializa
    loadMoreGames();
});
