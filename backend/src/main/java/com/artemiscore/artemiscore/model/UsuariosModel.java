package com.artemiscore.artemiscore.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
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

    @Column(name = "uid")
    private String uid;


    @Column(nullable=false)
    private String nome;

    @Column(nullable=false, unique = true)
    private String email;

    @Column(nullable=false)
    private String senha;

    @Column
    private String bio;

    @Column(columnDefinition = "LONGTEXT")
    private String foto_perfil;

    @Column(nullable=false)
    private LocalDate data_criacao;

    @ElementCollection
    private List<String> preferencias_jogos;

    @ElementCollection
    private List<String> plataformas_utilizadas;

    @Column(length = 500)
    private String jogos_favoritos; // Armazenará IDs separados por vírgula (ex: "123,456,789")

    // Método auxiliar para converter string para lista
    public List<Long> getJogosFavoritosList() {
        if (jogos_favoritos == null || jogos_favoritos.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.stream(jogos_favoritos.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());
    }

    // Método auxiliar para converter lista para string
    public void setJogosFavoritosList(List<Long> jogosIds) {
        if (jogosIds == null || jogosIds.isEmpty()) {
            this.jogos_favoritos = null;
        } else {
            this.jogos_favoritos = jogosIds.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
        }
    }
}
