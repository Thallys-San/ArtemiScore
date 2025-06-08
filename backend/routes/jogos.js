const express = require('express');
const router = express.Router();
require('dotenv').config();
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Gêneros
router.get('/generos', async (req, res) => {
  try {
    const response = await fetch(`https://api.rawg.io/api/genres?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar gêneros.' });
  }
});

router.get('/generos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/genres/${id}?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar o gênero.' });
  }
});

// Plataformas
router.get('/plataformas', async (req, res) => {
  try {
    const response = await fetch(`https://api.rawg.io/api/platforms?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar plataformas.' });
  }
});

router.get('/plataformas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/platforms/${id}?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar detalhes da plataforma.' });
  }
});

// Buscar jogos por nome
router.get('/', async (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.status(400).json({ erro: 'Parâmetro "nome" é obrigatório.' });

  try {
    const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(nome)}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar jogos.' });
  }
});

// Detalhes do jogo
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar detalhes do jogo.' });
  }
});

// Screenshots
router.get('/:id/screenshots', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}/screenshots?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar screenshots.' });
  }
});

// Lojas
router.get('/:id/stores', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}/stores?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar lojas.' });
  }
});

// DLCs
router.get('/:id/additions', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}/additions?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar DLCs.' });
  }
});

// Conquistas
router.get('/:id/achievements', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`https://api.rawg.io/api/games/${id}/achievements?key=${RAWG_API_KEY}`);
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar conquistas.' });
  }
});

module.exports = router;
