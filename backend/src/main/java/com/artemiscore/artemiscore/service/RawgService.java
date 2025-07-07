package com.artemiscore.artemiscore.service;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.artemiscore.artemiscore.model.rawghApi.*;

import java.util.Arrays;
import java.util.List;

@Service
public class RawgService {

    @Value("${rawg.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private static final String BASE_URL = "https://api.rawg.io/api/";

    public RawgService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
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

    return response.getBody().getResults();
}


    public GameDTO getGameById(Long id) {
        String url = BASE_URL + "games/" + id + "?key=" + apiKey;
        try {
            return restTemplate.getForObject(url, GameDTO.class);
        } catch (HttpClientErrorException.NotFound e) {
            // Retorna null se não encontrar o jogo na API RAWG (erro 404)
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
    return response.getBody();
    }

        // Game Ca
        public List<GameCardDTO> getBasicGameCards() {
        List<GameDTO> jogos = searchGames(null); // busca jogos da API

        return jogos.stream().map(j -> {
            GameDTO detalhado = getGameBySlug(j.getSlug()); // uma chamada por jogo

            GameCardDTO card = new GameCardDTO();
            card.setId(j.getId());
            card.setName(j.getName());
            card.setSlug(j.getSlug());
            card.setReleased(j.getReleased());
            card.setBackground_image(j.getBackground_image());

            if (detalhado != null) {
                card.setDescription(detalhado.getDescription());
                card.setDescription_raw(detalhado.getDescription_raw());
            }

            return card;
        }).toList();
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