/* ===================== GAME CARD (unificado com ReleaseCard) ===================== */
.game-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  background-color: #1a1a1a;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
  min-height: 380px;
}

.game-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.5);
  border-color: #5733ef;
}

.game-image-container {
  position: relative;
  width: 100%;
}

.game-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;
}

.game-card:hover .game-img {
  transform: scale(1.05);
}

.game-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-grow: 1;
}

.game-title {
  font-size: 1.1rem;
  color: #f1faee;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Igual ao release-title */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: 3.2em;
  min-height: 1.6em;
  margin: 0;
}

.platform-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 5px 0;
}

.platform-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.score {
  color: #a8dadc;
  font-size: 0.9rem;
  font-weight: bold;
}

.game-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.tag {
  background-color: rgba(69, 123, 157, 0.2);
  color: #457b9d;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #457b9d;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

/* Responsividade igual ao ReleaseCard */
@media (max-width: 768px) {
  .game-card {
    min-height: 350px;
  }

  .game-content {
    padding: 1rem;
  }

  .game-title {
    font-size: 1rem;
  }

  .tag {
    font-size: 11px;
    padding: 2px 6px;
  }
}

@media (max-width: 480px) {
  .game-card {
    min-height: 320px;
  }
}
