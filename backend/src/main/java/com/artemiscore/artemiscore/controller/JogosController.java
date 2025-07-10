package com.artemiscore.artemiscore.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.rawghApi.AchievementDTO;
import com.artemiscore.artemiscore.model.rawghApi.GameCardDTO;
import com.artemiscore.artemiscore.model.rawghApi.GameDTO;
import com.artemiscore.artemiscore.model.rawghApi.GenreDTO;
import com.artemiscore.artemiscore.model.rawghApi.PlatformDTO;
import com.artemiscore.artemiscore.model.rawghApi.ScreenshotDTO;
import com.artemiscore.artemiscore.model.rawghApi.StoreDTO;
import com.artemiscore.artemiscore.service.RawgService;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
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
    try {
        List<GameDTO> games = rawgService.searchGames(nome);
        // Se não passar nome, retorna todos os jogos
        if (nome == null || nome.trim().isEmpty()) {
            return ResponseEntity.ok(games);
        }
        // Se passar nome e a lista estiver vazia
        if (games == null || games.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Nenhum jogo encontrado com o nome: " + nome);
        }
        // Se encontrar jogos, retorna lista filtrada
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

    // --------------------- Detalhes de Jogo por Slug ---------------------
    @GetMapping("/slug/{slug}")
    public ResponseEntity<?> getGameBySlug(@PathVariable String slug) {
        try {
            GameDTO game = rawgService.getGameBySlug(slug);
            if (game == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Jogo não encontrado com o slug: " + slug);
            }
            return ResponseEntity.ok(game);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar jogo: " + e.getMessage());
        }
    }

    @GetMapping("/detalhado")
public ResponseEntity<?> getAllGamesWithDescription() {
    try {
        List<GameDTO> jogos = rawgService.searchGames(null); // pega todos os jogos (ou pagine se quiser)
        if (jogos == null || jogos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum jogo encontrado.");
        }

        // Para cada jogo, busca os detalhes completos pelo slug e atualiza as descrições
        for (GameDTO jogo : jogos) {
            GameDTO detalhado = rawgService.getGameBySlug(jogo.getSlug());
            if (detalhado != null) {
                jogo.setDescription(detalhado.getDescription());
                jogo.setDescription_raw(detalhado.getDescription_raw());
            }
        }
        return ResponseEntity.ok(jogos);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Erro ao buscar jogos detalhados: " + e.getMessage());
    }
    }


    // --------------------- Cards de Jogo ---------------------
    @GetMapping("/cards")
    public ResponseEntity<?> getGameCards() {
        try {
            List<GameCardDTO> cards = rawgService.getBasicGameCards();
            if (cards == null || cards.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum card de jogo encontrado.");
            }
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar cards: " + e.getMessage());
        }
    }

    @GetMapping("/cards/upcoming")
    public ResponseEntity<?> getUpcomingGameCards() {
        try {
            List<GameCardDTO> cards = rawgService.getUpcomingGameCards();
            if (cards == null || cards.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum jogo futuro encontrado.");
            }
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar jogos futuros: " + e.getMessage());
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
