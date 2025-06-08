const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importa o banco de dados SQLite
const bcrypt = require('bcrypt');
const app = express();
const PORT = 3000;
require('dotenv').config();
const RAWG_API_KEY = process.env.RAWG_API_KEY;

app.use(cors());
app.use(express.json());
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/avaliacoes', require('./routes/avaliacoes'));
app.use('/api/jogos', require('./routes/jogos'));

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Bem-vindo à API de Jogos!');
});






