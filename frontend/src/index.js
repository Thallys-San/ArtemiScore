document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("game-container");
    const MAX_DESC_LENGTH = 150;
    const MAX_CARDS = 8;

    fetch("http://localhost:8080/api/games/cards")
        .then(res => res.json())
        .then(cards => {
            if (!Array.isArray(cards) || cards.length === 0) {
                container.innerHTML = "<p>Nenhum jogo encontrado.</p>";
                return;
            }

            container.innerHTML = "";

            const limitedCards = cards.slice(0, MAX_CARDS);

            limitedCards.forEach(jogo => {
                let descricao = jogo.description_raw || jogo.description || "Sem descrição disponível.";
                descricao = descricao.replace(/<[^>]*>/g, "");

                if (descricao.length > MAX_DESC_LENGTH) {
                    descricao = descricao.substring(0, MAX_DESC_LENGTH) + "...";
                }

                const card = document.createElement("div");
                card.className = "game-card";

                // MODIFICAÇÃO AQUI: Pedindo imagem com 400px de largura e 250px de altura (proporção 16:10)
                const optimizedImageUrl = jogo.background_image 
                    ? jogo.background_image.replace('/media/', '/media/resize/400x250/-/') 
                    : 'https://via.placeholder.com/400x250?text=Sem+Imagem'; // Fallback com a mesma proporção

                card.innerHTML = `
                    <img src="${optimizedImageUrl}" alt="${jogo.name}" class="game-img">
                    <div class="game-content">
                        <h2>${jogo.name}</h2>
                        <p class="descricao">${descricao}</p>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Erro ao carregar jogos:", err);
            container.innerHTML = "<p>Erro ao carregar jogos.</p>";
        });
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("game-container");
    const MAX_CARDS = 8;

    fetch("http://localhost:8080/api/games/cards")
        .then(res => res.json())
        .then(cards => {
            if (!Array.isArray(cards) || cards.length === 0) {
                container.innerHTML = "<p>Nenhum jogo encontrado.</p>";
                return;
            }

            container.innerHTML = "";
            const limitedCards = cards.slice(0, MAX_CARDS);

            limitedCards.forEach(jogo => {
                const card = document.createElement("div");
                card.className = "release-card";

                const imgURL = jogo.background_image
                    ? jogo.background_image.replace('/media/', '/media/resize/400x250/-/')
                    : 'https://via.placeholder.com/400x250?text=Sem+Imagem';

                const date = new Date(jogo.released || jogo.release_date);
                const dia = date.getDate().toString().padStart(2, '0');
                const mes = date.toLocaleString('pt-BR', { month: 'short' }).toUpperCase();

                const plataformas = (jogo.platforms || [])
                    .map(p => `<span class="platform-tag">${p}</span>`)
                    .join("");

                card.innerHTML = `
                    <div class="release-date">
                        <span class="release-day">${dia}</span>
                        <span class="release-month">${mes}</span>
                    </div>
                    <img src="${imgURL}" alt="${jogo.name}" class="release-image">
                    <div class="release-info">
                        <h3 class="release-title">${jogo.name}</h3>
                        <div class="release-platforms">${plataformas}</div>
                        <div class="release-wishlist">
                            <button class="wishlist-button">
                                <i class="ri-heart-line"></i> Lista de Desejos
                            </button>
                        </div>
                    </div>
                `;

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Erro ao carregar jogos:", err);
            container.innerHTML = "<p>Erro ao carregar jogos.</p>";
        });
});
