document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("game-container");
  const MAX_DESC_LENGTH = 150;

  fetch("http://localhost:8080/api/games/cards")
    .then(res => res.json())
    .then(cards => {
      if (!Array.isArray(cards) || cards.length === 0) {
        container.innerHTML = "<p>Nenhum jogo encontrado.</p>";
        return;
      }

      container.innerHTML = "";

      cards.forEach(jogo => {
        let descricao = jogo.description_raw || jogo.description || "Sem descrição disponível.";
        descricao = descricao.replace(/<[^>]*>/g, "");

        if (descricao.length > MAX_DESC_LENGTH) {
          descricao = descricao.substring(0, MAX_DESC_LENGTH) + "...";
        }

        const card = document.createElement("div");
        card.className = "game-card";

        card.innerHTML = `
          <img src="${jogo.background_image || 'https://via.placeholder.com/400x200?text=Sem+Imagem'}" alt="${jogo.name}" class="game-img">
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
