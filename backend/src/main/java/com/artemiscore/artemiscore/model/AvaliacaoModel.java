package com.artemiscore.artemiscore.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "avaliacoes")
@Getter
@Setter

@NoArgsConstructor
public class AvaliacaoModel {

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column (nullable = false )
    private Long usuario_id;

    @Column (nullable = false)
    private Long jogo_id;

    @DecimalMin(value = "1.0", inclusive = true)
    @DecimalMax(value = "5.0", inclusive = true)
    @Column (nullable = false)
    private Double nota;

    @Column
    private Integer tempoDeJogo;

    @Column(nullable = false, length = 255)
    private String plataforma;

    @Column
    private String comentario;

    @Column(name = "data_avaliacao")
private LocalDateTime dataAvaliacao;

}
