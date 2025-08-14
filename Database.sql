CREATE DATABASE IF NOT EXISTS ArtemiScore;
use ArtemiScore;

CREATE TABLE IF NOT EXISTS usuarios (
   id BIGINT AUTO_INCREMENT PRIMARY KEY,
   uid VARCHAR(50) UNIQUE,
   nome VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   senha VARCHAR(255) NOT NULL,
   bio VARCHAR(300),
   foto_perfil TEXT,
   preferencias_jogos VARCHAR(800),
   plataformas_utilizadas VARCHAR(800),
   jogos_favoritos VARCHAR(500),
	data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS avaliacoes (
	id BIGINT PRIMARY KEY auto_increment,
	usuario_id BIGINT NOT NULL,
	jogo_id BIGINT NOT NULL, -- id do jogo na API RAWG
	nota DOUBLE NOT NULL,
	comentario TEXT,
	tempoDeJogo INT,
	plataforma VARCHAR(255) NOT NULL,
	data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    CONSTRAINT unique_usuario_jogo_plataforma UNIQUE (usuario_id, jogo_id, plataforma)
);
