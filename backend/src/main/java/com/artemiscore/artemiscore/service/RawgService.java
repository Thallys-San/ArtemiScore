package com.artemiscore.artemiscore.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;


import com.artemiscore.artemiscore.model.rawghApi.*;
import com.artemiscore.artemiscore.repository.AvaliacaoRepository;

import java.util.Arrays;
import java.util.List;

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
public List<GameDTO> searchGames(String name) {
    String url = BASE_URL + "games?key=" + apiKey;
    if (name != null && !name.trim().isEmpty()) {
        url += "&search=" + name.trim();
    }

    ResponseEntity<RawghResponse<GameDTO>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<RawghResponse<GameDTO>>() {}
    );

    List<GameDTO> lista = response.getBody().getResults();
    lista.forEach(this::adicionarDadosDeAvaliacao); // ✅ insere avaliações em todos
    return lista;
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
public List<GameCardDTO> getBasicGameCards() {
    List<GameDTO> jogos = searchGames(null); // busca jogos da API

    return jogos.stream().map(j -> {
        GameDTO detalhado = getGameBySlug(j.getSlug()); // já com avaliações

        GameCardDTO card = new GameCardDTO();
        card.setId(j.getId());
        card.setName(j.getName());
        card.setSlug(j.getSlug());
        card.setReleased(j.getReleased());
        card.setBackground_image(j.getBackground_image());

        if (detalhado != null) {
            card.setDescription(detalhado.getDescription());
            card.setDescription_raw(detalhado.getDescription_raw());

            // Copia avaliações do GameDTO detalhado para o card
            card.setMediaAvaliacao(detalhado.getMediaAvaliacao());
            card.setTotalAvaliacoes(detalhado.getTotalAvaliacoes());
            card.setAvaliacoes(detalhado.getAvaliacoes());

        }

        return card;
    }).toList();
}



    public List<GameCardDTO> getUpcomingGameCards() {
    // Define o intervalo de datas: hoje até 2 anos depois
    String url = BASE_URL + "games?key=" + apiKey
               + "&dates=" + java.time.LocalDate.now() + ",2026-12-31"
               + "&ordering=released";

    ResponseEntity<RawghResponse<GameDTO>> response = restTemplate.exchange(
        url,
        HttpMethod.GET,
        null,
        new ParameterizedTypeReference<RawghResponse<GameDTO>>() {}
    );

    List<GameDTO> jogos = response.getBody().getResults();

    return jogos.stream().map(j -> {
        GameDTO detalhado = getGameBySlug(j.getSlug()); // pega descrição

        GameCardDTO card = new GameCardDTO();
        card.setId(j.getId());
        card.setName(j.getName());
        card.setSlug(j.getSlug());
        card.setReleased(j.getReleased());
        card.setBackground_image(j.getBackground_image());

        if (detalhado != null) {
            card.setDescription(detalhado.getDescription());
            card.setDescription_raw(detalhado.getDescription_raw());

            
            // Copia avaliações do GameDTO detalhado para o card
            card.setMediaAvaliacao(detalhado.getMediaAvaliacao());
            card.setTotalAvaliacoes(detalhado.getTotalAvaliacoes());
            card.setAvaliacoes(detalhado.getAvaliacoes());

        }

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