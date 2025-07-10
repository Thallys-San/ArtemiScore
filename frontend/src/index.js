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
                    : './assets/images/sem-imagem.jpg';

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

    // Limpa antes de adicionar
    container.innerHTML = '';
    score.textContent = `${nota.toFixed(1)}/5`;

    const full = Math.floor(nota);
    const half = nota % 1 >= 0.25 && nota % 1 <= 0.75;
    const empty = 5 - full - (half ? 1 : 0);

    // Estilo comum
    const starStyle = 'color: #FDB813; font-size: 1rem; margin-right: 2px;';

    for (let i = 0; i < full; i++) {
        const icon = document.createElement('i');
        icon.className = 'ri-star-fill';
        icon.style = starStyle;
        container.appendChild(icon);
    }

    if (half) {
        const icon = document.createElement('i');
        icon.className = 'ri-star-half-fill';
        icon.style = starStyle;
        container.appendChild(icon);
    }

    for (let i = 0; i < empty; i++) {
        const icon = document.createElement('i');
        icon.className = 'ri-star-line';
        icon.style = 'color: #DDD; font-size: 1rem; margin-right: 2px;';
        container.appendChild(icon);
    }
}

