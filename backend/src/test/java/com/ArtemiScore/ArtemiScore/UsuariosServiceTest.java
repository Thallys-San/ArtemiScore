package com.ArtemiScore.ArtemiScore;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;
import com.artemiscore.artemiscore.service.UsuariosService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
public class UsuariosServiceTest {

    @Mock
    private UsuariosRepository repository;

    @Mock
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuariosService service;

    private UsuariosModel usuario;

    @BeforeEach
    void setUp() {
        usuario = new UsuariosModel();
        usuario.setId(1L);
        usuario.setNome("Alice");
        usuario.setEmail("alice@email.com");
        usuario.setSenha("senhaSemHash");
    }

    @Test
    void deveListarTodosUsuarios() {
        UsuariosModel u2 = new UsuariosModel();
        u2.setId(2L);
        u2.setNome("Bob");
        u2.setEmail("bob@email.com");
        u2.setSenha("senhaBob");

        when(repository.findAll()).thenReturn(Arrays.asList(usuario, u2));

        List<UsuariosModel> usuarios = service.listarTodos();

        assertEquals(2, usuarios.size());
        verify(repository, times(1)).findAll();
    }

    @Test
    void deveListarUsuarioPorId() {
        when(repository.findById(1L)).thenReturn(Optional.of(usuario));

        Optional<UsuariosModel> resultado = service.listarId(1L);

        assertTrue(resultado.isPresent());
        assertEquals("Alice", resultado.get().getNome());
        verify(repository).findById(1L);
    }

    @Test
    void deveSalvarUsuarioComSenhaNaoHasheada() {
        // Simula que passwordEncoder.encode retorna hash
        when(passwordEncoder.encode("senhaSemHash")).thenReturn("$2a$10$hashdummyhashdummyhashdummyhashdummyhashdummyhashdummyha");

        // Simula o save do repository retornando o mesmo objeto
        when(repository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        UsuariosModel salvo = service.salvar(usuario);

        // Verifica se a senha foi alterada para hash
        assertTrue(salvo.getSenha().startsWith("$2a$10$"));

        verify(passwordEncoder).encode("senhaSemHash");
        verify(repository).save(usuario);
    }

    @Test
    void deveSalvarUsuarioComSenhaJaHasheada() {
        // Define senha já com hash (padrão BCrypt)
        usuario.setSenha("$2a$10$hashdummyhashdummyhashdummyhashdummyhashdummyhashdummyha");

        UsuariosModel salvo = service.salvar(usuario);

        // Nesse caso passwordEncoder.encode NÃO deve ser chamado
        verify(passwordEncoder, never()).encode(any());

        verify(repository).save(usuario);

        // Senha deve permanecer a mesma
        assertEquals("$2a$10$hashdummyhashdummyhashdummyhashdummyhashdummyhashdummyha", salvo.getSenha());
    }

    @Test
    void deveDeletarUsuarioPorId() {
        service.deletar(1L);

        verify(repository).deleteById(1L);
    }
}
