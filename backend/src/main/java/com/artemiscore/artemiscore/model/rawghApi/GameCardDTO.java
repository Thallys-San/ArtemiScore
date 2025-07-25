<<<<<<< HEAD
package com.artemiscore.artemiscore.model.rawghApi;

import java.util.List;

import com.artemiscore.artemiscore.model.AvaliacaoModel;

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

    private Double mediaAvaliacao;
    private Integer totalAvaliacoes;
    private List<AvaliacaoModel> avaliacoes;

}
=======
package com.artemiscore.artemiscore.model.rawghApi;

import java.util.List;

import com.artemiscore.artemiscore.model.AvaliacaoModel;

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

    private Double mediaAvaliacao;
    private Integer totalAvaliacoes;
    private List<AvaliacaoModel> avaliacoes;

}
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
