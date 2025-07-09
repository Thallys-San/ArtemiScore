package com.artemiscore.artemiscore.model.rawghApi;

import lombok.Data;

@Data
public class GameCardDTO {
    private Long id;
    private String name;
    private String slug;
    private String released;
    private String background_image;
    private String description;
    private String description_raw;
}
