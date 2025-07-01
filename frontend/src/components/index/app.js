document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("game-container");

  fetch("http://localhost:8080/api/games")
    .then(res => res.json())
    .then(jogos => { // aqui, 'jogos' já é o array direto
      if (!Array.isArray(jogos) || jogos.length === 0) {
        container.innerHTML = "<p>Nenhum jogo encontrado.</p>";
        return;
      }

      jogos.forEach(jogo => {
        const card = document.createElement("div");
        card.className = "game-card";

        const nome = jogo.name || "Jogo sem nome";
        const imagem = jogo.background_image || "https://via.placeholder.com/400x200?text=Sem+Imagem";
        const nota = jogo.rating || "N/A";
        const descricao = jogo.description_raw || "Sem descrição disponível.";

        card.innerHTML = `
          <img src="${imagem}" alt="${nome}" class="game-img">
          <div class="game-content">
            <h2>${nome}</h2>
            <p class="descricao">${descricao}</p>
            <p class="nota">Nota: <strong>${nota}</strong></p>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao buscar jogos:", err);
      container.innerHTML = "<p>Erro ao carregar jogos.</p>";
    });
});
