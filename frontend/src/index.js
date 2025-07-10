document.addEventListener("DOMContentLoaded", () => {
    const popularContainer = document.getElementById("game-container");
    const releasesContainer = document.getElementById("releases-container");
    const MAX_DESC_LENGTH = 150;
    const MAX_POPULAR_CARDS = 8;
    const MAX_RELEASE_CARDS = 4;

    console.log("Script carregado corretamente");

    

    // ------------ POPULARES ------------
    fetch("http://localhost:8080/api/games/cards")
        .then(res => res.json())
        .then(cards => {
            if (!Array.isArray(cards) || cards.length === 0) {
                popularContainer.innerHTML = "<p>Nenhum jogo encontrado.</p>";
                return;
            }

            popularContainer.innerHTML = "";

            const limitedCards = cards.slice(0, MAX_POPULAR_CARDS);

            limitedCards.forEach(jogo => {
                let descricao = jogo.description_raw || jogo.description || "Sem descrição disponível.";
                descricao = descricao.replace(/<[^>]*>/g, "");

                if (descricao.length > MAX_DESC_LENGTH) {
                    descricao = descricao.substring(0, MAX_DESC_LENGTH) + "...";
                }

                const card = document.createElement("div");
                card.className = "game-card";

                const imageUrl = jogo.background_image
                    ? jogo.background_image
                    : './assets/images/sem-imagem.jpg';

                const ratingHTML = jogo.mediaAvaliacao != null
                    ? `
                        <div class="rating-box">
                            <div class="stars" id="stars-${jogo.id}"></div>
                            <span class="score" id="score-${jogo.id}"></span>
                        </div>
                      `
                    : "";

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${jogo.name}" class="game-img">
                    <div class="game-content">
                        <h2>${jogo.name}</h2>
                        <p class="descricao">${descricao}</p>
                        ${ratingHTML}
                    </div>
                `;

                popularContainer.appendChild(card);

                if (jogo.mediaAvaliacao != null) {
                    renderEstrelas(jogo.mediaAvaliacao, `stars-${jogo.id}`, `score-${jogo.id}`);
                }
            });
        })
        .catch(err => {
            console.error("Erro ao carregar jogos:", err);
            popularContainer.innerHTML = "<p>Erro ao carregar jogos.</p>";
        });


    // ------------ LANÇAMENTOS ------------
    fetch("http://localhost:8080/api/games/cards/upcoming")
        .then(res => res.json())
        .then(cards => {
            if (!Array.isArray(cards) || cards.length === 0) {
                releasesContainer.innerHTML = "<p>Nenhum jogo futuro encontrado.</p>";
                return;
            }

            releasesContainer.innerHTML = "";

            const limitedCards = cards.slice(0, MAX_RELEASE_CARDS);

            limitedCards.forEach(jogo => {
                const card = document.createElement("div");
                card.className = "release-card";

                const imgURL = jogo.background_image
                    ? jogo.background_image
                    : 'https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2Fx1sr1lob3ai41.jpg';

                const date = new Date(jogo.released || jogo.release_date);
                const dia = date.getDate().toString().padStart(2, '0');
                const mes = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();

                const plataformas = (jogo.platforms || [])
                    .map(p => `<span class="platform-tag">${p.platform.name}</span>`)
                    .join("");

                const ratingHTML = jogo.mediaAvaliacao != null
                    ? `
                        <div class="rating-box">
                            <div class="stars" id="stars-upcoming-${jogo.id}"></div>
                            <span class="score" id="score-upcoming-${jogo.id}"></span>
                        </div>
                      `
                    : "";

                card.innerHTML = `
                    <div class="release-date">
                        <span class="release-day">${dia}</span>
                        <span class="release-month">${mes}</span>
                    </div>
                    <img src="${imgURL}" alt="${jogo.name}" class="release-image">
                    <div class="release-info">
                        <h3 class="release-title">${jogo.name}</h3>
                        <div class="release-platforms">${plataformas}</div>
                        ${ratingHTML}
                        <div class="release-wishlist">
                            <button class="wishlist-button">
                                <i class="ri-heart-line"></i> Lista de Desejos
                            </button>
                        </div>
                    </div>
                `;

                releasesContainer.appendChild(card);

                if (jogo.mediaAvaliacao != null) {
                    renderEstrelas(jogo.mediaAvaliacao, `stars-upcoming-${jogo.id}`, `score-upcoming-${jogo.id}`);
                }
            });
        })
        .catch(err => {
            console.error("Erro ao carregar lançamentos:", err);
            releasesContainer.innerHTML = "<p>Erro ao carregar lançamentos.</p>";
        });
});


// ---------- Função de Estrelas ----------
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


// Exemplo de função que atualiza a imagem hero
function atualizarHero(backgroundImageUrl) {
    const img = document.querySelector('.hero-image');
    const heroBackground = document.querySelector('.hero-background');
    
    // Remover qualquer texto antigo de fallback se existir
    const textoFallbackExistente = document.querySelector('.fallback-text');
    if (textoFallbackExistente) textoFallbackExistente.remove();

    if (backgroundImageUrl && backgroundImageUrl.trim() !== '' && backgroundImageUrl !== 'null') {
        // Se existe imagem válida, define src e esconde texto
        img.src = backgroundImageUrl;
        img.style.display = 'block';
    } else {
        // Se for nulo ou vazio, usar logo padrão e mostrar texto de aviso
        img.src = 'images/logo-atermi.png'; // caminho da sua logo
        img.style.display = 'block';

        // Criar texto explicativo sobre ausência de imagem
        const fallbackText = document.createElement('div');
        fallbackText.className = 'fallback-text';
        fallbackText.textContent = 'Imagem não disponível';
        
        // Estilize para aparecer sobre a imagem, por exemplo
        fallbackText.style.position = 'absolute';
        fallbackText.style.top = '50%';
        fallbackText.style.left = '50%';
        fallbackText.style.transform = 'translate(-50%, -50%)';
        fallbackText.style.color = '#fff';
        fallbackText.style.backgroundColor = 'rgba(0,0,0,0.6)';
        fallbackText.style.padding = '10px 20px';
        fallbackText.style.borderRadius = '8px';
        fallbackText.style.fontSize = '1.2rem';
        fallbackText.style.fontWeight = '600';

        heroBackground.appendChild(fallbackText);
    }
}
