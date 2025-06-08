const express = require('express');
const router = express.Router();
const db = require('../db');

// Criar avaliação
router.post('/', (req, res) => {
  const { usuario_id, jogo_id, nota, comentario } = req.body;

  if (usuario_id == null || jogo_id == null || nota == null) {
    return res.status(400).json({ erro: 'usuario_id, jogo_id e nota são obrigatórios.' });
  }

  const sql = 'INSERT INTO avaliacoes (usuario_id, jogo_id, nota, comentario) VALUES (?, ?, ?, ?)';
  db.run(sql, [usuario_id, jogo_id, nota, comentario || null], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao criar avaliação.' });
    }
    res.status(201).json({ id: this.lastID, usuario_id, jogo_id, nota, comentario });
  });
});

// Buscar avaliações de um jogo
router.get('/jogo/:jogo_id', (req, res) => {
  const { jogo_id } = req.params;
  const sql = `
    SELECT a.id, a.nota, a.comentario, a.data_avaliacao, u.id AS usuario_id, u.nome AS usuario_nome
    FROM avaliacoes a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.jogo_id = ?
  `;
  db.all(sql, [jogo_id], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar avaliações.' });
    }
    res.json(rows);
  });
});

module.exports = router;
