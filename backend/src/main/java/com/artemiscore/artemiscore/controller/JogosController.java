
package com.artemiscore.artemiscore.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.AvaliacaoModel;
import com.artemiscore.artemiscore.model.rawghApi.AchievementDTO;
import com.artemiscore.artemiscore.model.rawghApi.GameCardDTO;
import com.artemiscore.artemiscore.model.rawghApi.GameDTO;
import com.artemiscore.artemiscore.model.rawghApi.GenreDTO;
import com.artemiscore.artemiscore.model.rawghApi.PlatformDTO;
import com.artemiscore.artemiscore.model.rawghApi.ScreenshotDTO;
import com.artemiscore.artemiscore.model.rawghApi.StoreDTO;
import com.artemiscore.artemiscore.service.AvaliacaoService;
import com.artemiscore.artemiscore.service.RawgService;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:3005", allowCredentials = "true")
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
@GetMapping("/search")
public ResponseEntity<?> searchGames(
    @RequestParam(required = false) String nome,
    @RequestParam(defaultValue = "0") int offset,
    @RequestParam(defaultValue = "10") int limit
) {
    try {
        if (limit <= 0) limit = 10;
        if (offset < 0) offset = 0;

        // Convertendo offset para página (RAWG usa 1-based)
        int page = (offset / limit) + 1;

        List<GameDTO> games = rawgService.searchGames(nome, page, limit);

        if (games == null || games.isEmpty()) {
            String message = (nome == null || nome.isBlank()) ?
                "Nenhum jogo encontrado." :
                "Nenhum jogo encontrado com o nome: " + nome;

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("message", message));
        }

        return ResponseEntity.ok(games);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(Collections.singletonMap("error", "Erro ao buscar jogos: " + e.getMessage()));
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



@GetMapping("/games/filter")
public ResponseEntity<?> filtrarJogos(
    @RequestParam(required = false) String nome,
    @RequestParam(required = false) List<String> generos,
    @RequestParam(required = false) List<String> plataformas,
    @RequestParam(defaultValue = "0") int offset,
    @RequestParam(defaultValue = "10") int limit
) {
    try {
        int page = (offset / limit) + 1;

        List<GameCardDTO> jogosFiltrados = rawgService.filtrarJogos(nome, generos, plataformas, page, limit);

        return ResponseEntity.ok(jogosFiltrados);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Erro ao buscar jogos com filtros: " + e.getMessage());
    }
}



    // --------------------- Cards de Jogo ---------------------
@GetMapping("/cards")
public ResponseEntity<?> getGameCards(
    @RequestParam(defaultValue = "0") int offset,
    @RequestParam(defaultValue = "20") int limit,
    @RequestParam(required = false) String generos,
    @RequestParam(required = false) String plataformas,
    @RequestParam(required = false) String sort
) {
    try {
        int page = (offset / limit) + 1;

        List<String> generosList = generos != null && !generos.isEmpty() ? List.of(generos.split(",")) : Collections.emptyList();
        List<String> plataformasList = plataformas != null && !plataformas.isEmpty() ? List.of(plataformas.split(",")) : Collections.emptyList();

        List<GameCardDTO> cards = rawgService.filtrarJogos(null, generosList, plataformasList, page, limit);

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
    public ResponseEntity<?> getUpcomingGameCards(
        @RequestParam(defaultValue = "0") int offset,
        @RequestParam(defaultValue = "20") int limit
    ) {
        
        try {
            int page = (offset / limit) + 1;


            List<GameCardDTO> cards = rawgService.getUpcomingGameCards(page, limit);
            if (cards == null || cards.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum jogo futuro encontrado.");
            }
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erro ao buscar jogos futuros: " + e.getMessage());
        }
    }

    @GetMapping
public ResponseEntity<?> getGamesByOffset(
    @RequestParam(defaultValue = "0") int offset,
    @RequestParam(defaultValue = "20") int limit,
    @RequestParam(required = false) String search
) {
    try {
        if (limit <= 0) limit = 20;
        if (offset < 0) offset = 0;

        int page = (offset / limit) + 1;

        List<GameDTO> games = rawgService.searchGames(search, page, limit);
        if (games == null || games.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Nenhum jogo encontrado.");
        }

        return ResponseEntity.ok(games);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Erro ao buscar jogos: " + e.getMessage());
    }
}

@GetMapping("/top-rated")
public ResponseEntity<?> getTopRatedGames(
    @RequestParam(defaultValue = "0") int offset,
    @RequestParam(defaultValue = "10") int limit
) {
    try {
        int page = (offset / limit); // page começa em 0 no PageRequest.of
        List<GameDTO> topRatedGames = rawgService.getTopRatedGames(page, limit);

        // Retorna 200 com lista vazia, caso não encontre nenhum jogo
        return ResponseEntity.ok(topRatedGames);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Erro ao buscar os jogos melhor avaliados: " + e.getMessage());
    }
}

/**
     * Endpoint para obter os jogos mais bem avaliados no mês atual.
     * 
     * Exemplo de chamada: GET /avaliacoes/top-rated-monthly?page=1&limit=10
     *
     * @param page  número da página (1-based)
     * @param limit quantidade de itens por página
     * @return lista paginada de GameDTO com média de avaliação do mês
     */
    @GetMapping("/top-rated-monthly")
    public ResponseEntity<List<GameDTO>> getTopRatedGamesMonthly(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {
        
        if (page < 1 || limit < 1) {
            return ResponseEntity.badRequest().build();
        }

        List<GameDTO> jogos = rawgService.getTopRatedGamesMonthly(page, limit);
        
        if (jogos.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        
        return ResponseEntity.ok(jogos);
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
