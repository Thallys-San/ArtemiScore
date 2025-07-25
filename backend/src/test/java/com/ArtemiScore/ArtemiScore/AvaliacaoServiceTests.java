package com.ArtemiScore.ArtemiScore;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.artemiscore.artemiscore.model.AvaliacaoModel;
import com.artemiscore.artemiscore.model.rawghApi.GameDTO;
import com.artemiscore.artemiscore.repository.AvaliacaoRepository;
import com.artemiscore.artemiscore.service.AvaliacaoService;
import com.artemiscore.artemiscore.service.RawgService;

class AvaliacaoServiceTest {

    @Mock
    private AvaliacaoRepository repository;

    @Mock
    private RawgService rawgService;

    @InjectMocks
    private AvaliacaoService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveListarTodos() {
        AvaliacaoModel avaliacao1 = new AvaliacaoModel();
        AvaliacaoModel avaliacao2 = new AvaliacaoModel();
        when(repository.findAll()).thenReturn(Arrays.asList(avaliacao1, avaliacao2));

        List<AvaliacaoModel> result = service.listarTodos();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void deveListarPorId() {
        AvaliacaoModel avaliacao = new AvaliacaoModel();
        when(repository.findById(1L)).thenReturn(Optional.of(avaliacao));

        Optional<AvaliacaoModel> result = service.listarId(1L);

        assertTrue(result.isPresent());
        verify(repository).findById(1L);
    }

    @Test
    void deveSalvarQuandoJogoExistente() {
        AvaliacaoModel avaliacao = new AvaliacaoModel();
        avaliacao.setJogo_id(10L);
        when(rawgService.getGameById(10L)).thenReturn(new GameDTO()); // qualquer objeto para simular jogo existente
        when(repository.save(avaliacao)).thenReturn(avaliacao);

        AvaliacaoModel salvo = service.salvar(avaliacao);

        assertNotNull(salvo);
        verify(repository).save(avaliacao);
    }

    @Test
    void deveLancarExcecaoQuandoJogoNaoExiste() {
        AvaliacaoModel avaliacao = new AvaliacaoModel();
        avaliacao.setJogo_id(10L);
        when(rawgService.getGameById(10L)).thenReturn(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () -> {
            service.salvar(avaliacao);
        });

        assertEquals("Jogo inválido ou não encontrado na API RAWG", ex.getMessage());
        verify(repository, never()).save(any());
    }

    @Test
    void deveDeletarPorId() {
        service.deletar(5L);

        verify(repository).deleteById(5L);
    }
}