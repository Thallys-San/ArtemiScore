package com.ArtemiScore.ArtemiScore.controller;

import com.ArtemiScore.ArtemiScore.model.rawghApi.*;
import com.ArtemiScore.ArtemiScore.service.RawgService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games")
public class JogosController {

    private final RawgService rawgService;

    public JogosController(RawgService rawgService) {
        this.rawgService = rawgService;
    }

    // --------------------- Gêneros ---------------------
    @GetMapping("/generos")
    public ResponseEntity<?> getGenres() {
        try {
            List<GenreDTO> genres = rawgService.getGenres();
            if (genres == null || genres.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum gênero encontrado.");
            }
            return ResponseEntity.ok(genres);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar gêneros: " + e.getMessage());
        }
    }

    @GetMapping("/generos/{id}")
    public ResponseEntity<?> getGenreById(@PathVariable Long id) {
        try {
            GenreDTO genre = rawgService.getGenreById(id);
            if (genre == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Gênero não encontrado com ID: " + id);
            }
            return ResponseEntity.ok(genre);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar gênero: " + e.getMessage());
        }
    }

    // --------------------- Plataformas ---------------------
    @GetMapping("/plataformas")
    public ResponseEntity<?> getPlatforms() {
        try {
            List<PlatformDTO> platforms = rawgService.getPlatforms();
            if (platforms == null || platforms.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhuma plataforma encontrada.");
            }
            return ResponseEntity.ok(platforms);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar plataformas: " + e.getMessage());
        }
    }

    @GetMapping("/plataformas/{id}")
    public ResponseEntity<?> getPlatformById(@PathVariable Long id) {
        try {
            PlatformDTO platform = rawgService.getPlatformById(id);
            if (platform == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Plataforma não encontrada com ID: " + id);
            }
            return ResponseEntity.ok(platform);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar plataforma: " + e.getMessage());
        }
    }

    // --------------------- Buscar Jogos por Nome ---------------------
    @GetMapping
    public ResponseEntity<?> searchGames(@RequestParam(required = false) String nome) {
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Parâmetro 'nome' é obrigatório.");
        }
        try {
            List<GameDTO> games = rawgService.searchGames(nome);
            if (games == null || games.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhum jogo encontrado com o nome: " + nome);
            }
            return ResponseEntity.ok(games);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar jogos: " + e.getMessage());
        }
    }

    // --------------------- Detalhes de Jogo ---------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getGameById(@PathVariable Long id) {
        try {
            GameDTO game = rawgService.getGameById(id);
            if (game == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Jogo não encontrado com ID: " + id);
            }
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar jogo: " + e.getMessage());
        }
    }

    // --------------------- Screenshots ---------------------
    @GetMapping("/{id}/screenshots")
    public ResponseEntity<?> getGameScreenshots(@PathVariable Long id) {
        try {
            List<ScreenshotDTO> screenshots = rawgService.getGameScreenshots(id);
            if (screenshots == null || screenshots.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhuma screenshot encontrada para o jogo com ID: " + id);
            }
            return ResponseEntity.ok(screenshots);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar screenshots: " + e.getMessage());
        }
    }

    // --------------------- Lojas ---------------------
    @GetMapping("/{id}/stores")
    public ResponseEntity<?> getGameStores(@PathVariable Long id) {
        try {
            List<StoreDTO> stores = rawgService.getGameStores(id);
            if (stores == null || stores.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhuma loja encontrada para o jogo com ID: " + id);
            }
            return ResponseEntity.ok(stores);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar lojas: " + e.getMessage());
        }
    }

    // --------------------- DLCs ---------------------
    @GetMapping("/{id}/additions")
    public ResponseEntity<?> getGameAdditions(@PathVariable Long id) {
        try {
            List<GameDTO> dlcs = rawgService.getGameAdditions(id);
            if (dlcs == null || dlcs.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhuma DLC encontrada para o jogo com ID: " + id);
            }
            return ResponseEntity.ok(dlcs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar DLCs: " + e.getMessage());
        }
    }

    // --------------------- Conquistas ---------------------
    @GetMapping("/{id}/achievements")
    public ResponseEntity<?> getGameAchievements(@PathVariable Long id) {
        try {
            List<AchievementDTO> achievements = rawgService.getGameAchievements(id);
            if (achievements == null || achievements.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nenhuma conquista encontrada para o jogo com ID: " + id);
            }
            return ResponseEntity.ok(achievements);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar conquistas: " + e.getMessage());
        }
    }
}
