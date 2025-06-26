package com.artemiscore.artemiscore.model;




import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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

    @Column (nullable = false, length = 2)
    private float nota;

    @Column
    private String comentario;

    @Column
    private LocalDate data_avaliacao;
}
