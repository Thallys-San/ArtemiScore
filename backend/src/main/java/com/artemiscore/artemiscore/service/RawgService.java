
package com.artemiscore.artemiscore.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.artemiscore.artemiscore.model.AvaliacaoModel;
import com.artemiscore.artemiscore.model.rawghApi.*;
import com.artemiscore.artemiscore.repository.AvaliacaoRepository;


import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;




@Service
public class RawgService {

    
    private final AvaliacaoRepository avaliacaoRepository;
    private final RestTemplate restTemplate;

    @Value("${rawg.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.rawg.io/api/";

    public RawgService(RestTemplate restTemplate, AvaliacaoRepository avaliacaoRepository) {
        this.restTemplate = restTemplate;
        this.avaliacaoRepository = avaliacaoRepository;
    }

    // Gêneros
    public List<GenreDTO> getGenres() {
    String url = BASE_URL + "genres?key=" + apiKey;

    ResponseEntity<RawghResponse<GenreDTO>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<RawghResponse<GenreDTO>>() {}
    );

    return response.getBody().getResults();
}

    public GenreDTO getGenreById(Long id) {
        String url = BASE_URL + "genres/" + id + "?key=" + apiKey;
        return restTemplate.getForObject(url, GenreDTO.class);
    }

    // Plataformas
    public List<PlatformDTO> getPlatforms() {
    String url = BASE_URL + "platforms?key=" + apiKey;

    ResponseEntity<RawghResponse<PlatformDTO>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<RawghResponse<PlatformDTO>>() {}
    );

    return response.getBody().getResults();
}


    public PlatformDTO getPlatformById(Long id) {
        String url = BASE_URL + "platforms/" + id + "?key=" + apiKey;
        return restTemplate.getForObject(url, PlatformDTO.class);
    }

    // Jogos
    
public List<GameDTO> searchGames(String name, int page, int pageSize) {
    if (page < 1) page = 1;
    if (pageSize <= 0) pageSize = 20;

    UriComponentsBuilder uriBuilder = UriComponentsBuilder
        .fromHttpUrl(BASE_URL + "games")
        .queryParam("key", apiKey)
        .queryParam("page", page)
        .queryParam("page_size", pageSize);

    if (name != null && !name.trim().isEmpty()) {
        uriBuilder.queryParam("search", name.trim());
    }

    String url = uriBuilder.toUriString();

    try {
        ResponseEntity<RawghResponse<GameDTO>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<RawghResponse<GameDTO>>() {}
        );

        RawghResponse<GameDTO> body = response.getBody();

        if (body == null || body.getResults() == null) {
            return Collections.emptyList();
        }

        List<GameDTO> lista = body.getResults();
        lista.forEach(this::adicionarDadosDeAvaliacao);
        return lista;
    } catch (Exception ex) {
        System.err.println("Erro ao buscar jogos na RAWG: " + ex.getMessage());
        return Collections.emptyList();
    }
}

    public GameDTO getGameById(Long id) {
    String url = BASE_URL + "games/" + id + "?key=" + apiKey;
    try {
        GameDTO game = restTemplate.getForObject(url, GameDTO.class);
        adicionarDadosDeAvaliacao(game); // ✅ insere avaliações
        return game;
    } catch (HttpClientErrorException.NotFound e) {
        return null;
    }
}


    public GameDTO getGameBySlug(String slug) {
    String url = BASE_URL + "games/" + slug + "?key=" + apiKey;
    ResponseEntity<GameDTO> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<GameDTO>() {}
    );
    GameDTO game = response.getBody();
    adicionarDadosDeAvaliacao(game); // ✅ insere avaliações
    return game;
}

        // Game Card
public List<GameCardDTO> getBasicGameCards(int page, int pageSize) {
    List<GameDTO> jogos = searchGames(null, page, pageSize); // agora usa paginação dinâmica

    return jogos.stream().map(j -> {
        GameCardDTO card = new GameCardDTO();
        card.setId(j.getId());
        card.setName(j.getName());
        card.setSlug(j.getSlug());
        card.setReleased(j.getReleased());
        card.setBackground_image(j.getBackground_image());

        // Dados opcionais de avaliação
        adicionarDadosDeAvaliacao(card);

        // Cards não precisam de descrição
        card.setDescription("");
        card.setDescription_raw("");

        return card;
    }).toList();
}





public List<GameCardDTO> getUpcomingGameCards(int page, int limit) {
    String url = BASE_URL + "games?key=" + apiKey
               + "&dates=" + java.time.LocalDate.now() + ",2026-12-31"
               + "&ordering=released" + "&page=" + page
               + "&page_size=" + limit;

    ResponseEntity<RawghResponse<GameDTO>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<RawghResponse<GameDTO>>() {}
    );

    List<GameDTO> jogos = response.getBody().getResults();

    return jogos.stream().map(j -> {
        GameCardDTO card = new GameCardDTO();
        card.setId(j.getId());
        card.setName(j.getName());
        card.setSlug(j.getSlug());
        card.setReleased(j.getReleased());
        card.setBackground_image(j.getBackground_image());

        // NÃO busca descrição detalhada aqui para evitar lentidão

        adicionarDadosDeAvaliacao(card); // mantém avaliação

        return card;
    }).toList();
}




private void adicionarDadosDeAvaliacao(GameDTO game) {
    if (game != null) {
        Long jogoId = game.getId();
        game.setMediaAvaliacao(avaliacaoRepository.findMediaAvaliacaoByJogoId(jogoId));
        game.setAvaliacoes(avaliacaoRepository.findAvaliacoesByJogoId(jogoId));
        game.setTotalAvaliacoes(game.getAvaliacoes() != null ? game.getAvaliacoes().size() : 0);
    }
}

private void adicionarDadosDeAvaliacao(GameCardDTO card) {
    if (card != null) {
        Long jogoId = card.getId();
        Double media = avaliacaoRepository.findMediaAvaliacaoByJogoId(jogoId);
        List<AvaliacaoModel> avaliacoes = avaliacaoRepository.findAvaliacoesByJogoId(jogoId);
        int total = avaliacoes != null ? avaliacoes.size() : 0;

        card.setMediaAvaliacao(media);
        card.setAvaliacoes(avaliacoes);
        card.setTotalAvaliacoes(total);
    }
}

public GameDTO getTopRatedGame(int page, int limit) {
    // Aqui a ideia é buscar os jogos ordenados pela média de avaliações decrescente
    List<GameDTO> jogos = this.searchGames(null, page, limit); // ou com filtro de ordenação

    if (jogos == null || jogos.isEmpty()) return null;

    // Suponha que já estejam ordenados pela média de avaliação (se não estiverem, ordene aqui)
    GameDTO topGame = jogos.get(0);

    // Pega detalhes completos (se quiser pegar avaliações detalhadas)
    GameDTO detalhado = this.getGameBySlug(topGame.getSlug());
    if (detalhado != null) {
        return detalhado;
    }

    return topGame;
}



public List<GameCardDTO> filtrarJogos(String nome, List<String> generos, List<String> plataformas, int page, int limit) {
    UriComponentsBuilder uriBuilder = UriComponentsBuilder
        .fromHttpUrl(BASE_URL + "games")
        .queryParam("key", apiKey)
        .queryParam("page", page)
        .queryParam("page_size", limit);

    if (nome != null && !nome.isBlank()) {
        uriBuilder.queryParam("search", nome.trim());
    }

    if (generos != null) {
        List<String> cleanGeneros = generos.stream()
            .filter(g -> g != null && !g.isBlank())
            .map(String::trim)
            .toList();
        if (!cleanGeneros.isEmpty()) {
            uriBuilder.queryParam("genres", String.join(",", cleanGeneros));
        }
    }

    if (plataformas != null) {
        List<String> cleanPlataformas = plataformas.stream()
            .filter(p -> p != null && !p.isBlank())
            .map(String::trim)
            .toList();
        if (!cleanPlataformas.isEmpty()) {
            uriBuilder.queryParam("platforms", String.join(",", cleanPlataformas));
        }
    }

    String url = uriBuilder.toUriString();

    try {
        ResponseEntity<RawghResponse<GameDTO>> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<RawghResponse<GameDTO>>() {}
        );

        List<GameDTO> results = response.getBody() != null ? response.getBody().getResults() : Collections.emptyList();

        return results.stream().map(j -> {
            GameCardDTO card = new GameCardDTO();
            card.setId(j.getId());
            card.setName(j.getName());
            card.setSlug(j.getSlug());
            card.setReleased(j.getReleased());
            card.setBackground_image(j.getBackground_image());

            adicionarDadosDeAvaliacao(card);

            card.setDescription("");
            card.setDescription_raw("");
            return card;
        }).collect(Collectors.toList());

    } catch (Exception e) {
        // Ideal usar logger aqui
        System.err.println("Erro ao filtrar jogos: " + e.getMessage());
        return Collections.emptyList();
    }
}



    // Screenshots
    public List<ScreenshotDTO> getGameScreenshots(Long gameId) {
        String url = BASE_URL + "games/" + gameId + "/screenshots?key=" + apiKey;
        return Arrays.asList(restTemplate.getForObject(url, ScreenshotDTO[].class));
    }

    // Lojas
    public List<StoreDTO> getGameStores(Long gameId) {
        String url = BASE_URL + "games/" + gameId + "/stores?key=" + apiKey;
        return Arrays.asList(restTemplate.getForObject(url, StoreDTO[].class));
    }

    // DLCs
    public List<GameDTO> getGameAdditions(Long gameId) {
        String url = BASE_URL + "games/" + gameId + "/additions?key=" + apiKey;
        return Arrays.asList(restTemplate.getForObject(url, GameDTO[].class));
    }

    // Conquistas
    public List<AchievementDTO> getGameAchievements(Long gameId) {
        String url = BASE_URL + "games/" + gameId + "/achievements?key=" + apiKey;
        return Arrays.asList(restTemplate.getForObject(url, AchievementDTO[].class));
    }
}