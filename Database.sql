CREATE DATABASE ArtemiScore;
use ArtemiScore;

CREATE TABLE usuarios (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   nome VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   senha VARCHAR(255) NOT NULL,
   descricao VARCHAR(300),
   foto_perfil VARCHAR(600)
);


CREATE TABLE avaliacoes (
  id BIGINT PRIMARY KEY auto_increment,
  usuario_id BIGINT NOT NULL,
  jogo_id BIGINT NOT NULL, -- id do jogo na API RAWG
  nota INTEGER NOT NULL CHECK(nota BETWEEN 1 AND 10),
  comentario TEXT,
  data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
);
