package com.artemiscore.artemiscore.model.rawghApi;



import java.util.List;

import com.artemiscore.artemiscore.model.AvaliacaoModel;

import lombok.Data;

@Data
public class GameDTO {
    private Long id;
    private String slug;
    private String name;
    private String name_original;
    private String description;
    private String description_raw;
    private String released;
    private String background_image;
    private String background_image_additional;
    private String updated;
    private String website;

    private Double mediaAvaliacao;
    private Long totalAvaliacoes;
    private List<AvaliacaoModel> avaliacoes;
     
    private ClipDTO clip;
    private List<ScreenshotDTO> screenshots;
    private List<PlatformWrapper> platforms;
    private List<Developer> developers;
    private List<Publisher> publishers;
    private List<Tag> tags;
    private List<GenreDTO> genres;
    private List<AchievementDTO> achievements;
    private List<StoreWrapper> stores;
    private EsrbRating esrb_rating;
    
    


}