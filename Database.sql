CREATE DATABASE ArtemiScore;
use ArtemiScore;

CREATE TABLE usuarios (
   id INT AUTO_INCREMENT PRIMARY KEY,
   nome VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   senha VARCHAR(255) NOT NULL
);


CREATE TABLE avaliacoes (
  id INTEGER PRIMARY KEY auto_increment,
  usuario_id INTEGER NOT NULL,
  jogo_id INTEGER NOT NULL, -- id do jogo na API RAWG
  nota INTEGER NOT NULL CHECK(nota BETWEEN 1 AND 10),
  comentario TEXT,
  data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);
