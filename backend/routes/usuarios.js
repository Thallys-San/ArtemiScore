const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

// Criar usuário
router.post('/', async (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
  }

  try {
    const hashSenha = await bcrypt.hash(senha, 10);
    const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    db.run(sql, [nome, email, hashSenha], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ erro: 'Email já cadastrado.' });
        }
        return res.status(500).json({ erro: 'Erro ao criar usuário.' });
      }
      res.status(201).json({ id: this.lastID, nome, email });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar usuário.' });
  }
});

// Buscar usuários
router.get('/', (req, res) => {
  const sql = 'SELECT id, nome, email FROM usuarios';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar usuários.' });
    }
    res.json(rows);
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ erro: 'Erro no servidor.' });
    if (!user) return res.status(401).json({ erro: 'Usuário não encontrado.' });

    const senhaCorreta = await bcrypt.compare(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ erro: 'Senha incorreta.' });

    res.json({ id: user.id, nome: user.nome, email: user.email });
  });
});

module.exports = router;
