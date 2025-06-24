package com.ArtemiScore.ArtemiScore.Model.RawghApi;

import lombok.Data;

@Data
public class GameDTO {
    private Long id;
    private String name;
    private String released;
    private String background_image;
    private Double rating;
    // Outros campos conforme necessário
}