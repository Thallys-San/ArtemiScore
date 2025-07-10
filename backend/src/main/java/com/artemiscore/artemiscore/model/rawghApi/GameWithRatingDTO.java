package com.artemiscore.artemiscore.model.rawghApi;

import java.util.List;

import com.artemiscore.artemiscore.model.AvaliacaoModel;

public class GameWithRatingDTO  {
    private GameDTO game;               // Dados principais do jogo
    private Double mediaAvaliacao;      // Nota média
    private Integer totalAvaliacoes;    // Total de avaliações
    private List<AvaliacaoModel> avaliacoes;
    
}
