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
@Table(name="usuarios")
@Getter
@Setter
@NoArgsConstructor
public class UsuariosModel {
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(nullable=false)
    private String nome;

    @Column(nullable=false, unique = true)
    private String email;

    @Column(nullable=false)
    private String senha;

    @Column
    private String bio;

    @Column
    private String foto_perfil;

    @Column(nullable=false)
    private LocalDate data_criacao;

    @Column
    private String preferencias_jogos;

    @Column
    private String plataformas_utilizadas;
}
