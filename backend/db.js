const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Banco local chamado database.sqlite na pasta backend
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Erro ao conectar no banco', err);
  } else {
    console.log('Conectado ao banco SQLite.');
  }
});

// Criar tabelas se não existirem
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    jogo_id INTEGER NOT NULL,
    nota INTEGER NOT NULL CHECK(nota BETWEEN 1 AND 10),
    comentario TEXT,
    data_avaliacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
  )`);
});

module.exports = db;
