package com.ArtemiScore.ArtemiScore;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;
import com.artemiscore.artemiscore.service.UsuariosService;

class UsuariosServiceTest {

    @Mock
    private UsuariosRepository repository;

    @InjectMocks
    private UsuariosService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void deveListarTodos() {
        UsuariosModel usuario = new UsuariosModel();
        when(repository.findAll()).thenReturn(Arrays.asList(usuario));

        List<UsuariosModel> result = service.listarTodos();

        assertEquals(2, result.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void deveListarPorId() {
        UsuariosModel usuario = new UsuariosModel();
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<UsuariosModel> result = service.listarId(1L);

        assertTrue(result.isPresent());
        verify(repository).findById(1L);
    }

    @Test
    void deveSalvarUsuario() {
        UsuariosModel usuario = new UsuariosModel();
        usuario.setNome("Bob");
        usuario.setEmail("bob@gmail.com");
        usuario.setSenha("1234");

        when(repository.save(usuario)).thenReturn(usuario);
        UsuariosModel salvo=service.salvar(usuario);

        assertNotNull(salvo);
        verify(repository).save(usuario);

    }

    

    @Test
    void deveDeletarPorId() {
        service.deletar(5L);

        verify(repository).deleteById(5L);
    }
}