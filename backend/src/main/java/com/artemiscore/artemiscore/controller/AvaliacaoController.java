package com.artemiscore.artemiscore.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.AvaliacaoModel;
import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;
import com.artemiscore.artemiscore.service.AvaliacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "http://localhost:3005", allowCredentials = "true")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService service;

    @Autowired
    private UsuariosRepository usuariosRepository;

    // ✅ Buscar todas as avaliações
    @GetMapping
    public List<AvaliacaoModel> listarTodos() {
        return service.listarTodos();
    }

    // ✅ Buscar uma avaliação pelo ID da avaliação (não do usuário)
    @GetMapping("/{id}")
    public ResponseEntity<AvaliacaoModel> buscarPorId(@PathVariable Long id) {
        Optional<AvaliacaoModel> avaliacao = service.listarId(id);
        return avaliacao.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // ✅ Buscar avaliações por ID do jogo
    @GetMapping("/jogo/{jogoId}")
    public ResponseEntity<List<AvaliacaoModel>> buscarPorJogo(@PathVariable Long jogoId) {
        List<AvaliacaoModel> avaliacoes = service.listarPorJogo(jogoId);
        if (avaliacoes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(avaliacoes);
    }

    // ✅ Buscar avaliações por ID do usuário
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AvaliacaoModel>> buscarPorUsuario(@PathVariable Long usuarioId) {
        List<AvaliacaoModel> avaliacoes = service.listarPorUsuario(usuarioId);
        if (avaliacoes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(avaliacoes);
    }

@GetMapping("/usuario/{usuarioId}/horas")
public ResponseEntity<Long> getTotalHorasPorUsuario(@PathVariable Long usuarioId) {
    Long totalHoras = avaliacaoRepository.getTotalHorasPorUsuario(usuarioId);

    if (totalHoras == null) {
        totalHoras = 0L;
    }

    return ResponseEntity.ok(totalHoras);
}
    
    // ✅ Criar uma nova avaliação
    @PostMapping
    public ResponseEntity<?> criar(@Valid @RequestBody AvaliacaoModel avaliacaoModel) {
        try {
            // Pega o UID do Firebase do usuário logado
            String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

            // Busca o usuário no banco
            UsuariosModel usuario = usuariosRepository.findByUid(uid)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            // Preenche o usuario_id
            avaliacaoModel.setUsuario_id(usuario.getId());

            // Salva a avaliação
            AvaliacaoModel novaAvaliacao = service.salvar(avaliacaoModel);
            return ResponseEntity.ok(novaAvaliacao);

        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    // ✅ Deletar uma avaliação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!service.listarId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

@GetMapping("/meus-jogos")
public ResponseEntity<List<AvaliacaoModel>> getMeusJogos() {
    try {
        // Pega o UID do usuário logado pelo token
        String uid = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Busca o usuário no banco pelo UID
        UsuariosModel usuario = usuariosRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Long usuarioId = usuario.getId();

        // Busca todas as avaliações do usuário pelo ID interno
        List<AvaliacaoModel> avaliacoes = service.listarPorUsuario(usuarioId);

        if (avaliacoes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(avaliacoes);

    } catch (Exception e) {
        return ResponseEntity.status(401).body(null);
    }
}

// ✅ Buscar avaliações de outro usuário pelo UID do Firebase
@GetMapping("/usuario/uid/{uid}")
public ResponseEntity<List<AvaliacaoModel>> buscarPorUsuarioUid(@PathVariable String uid) {
    try {
        UsuariosModel usuario = usuariosRepository.findByUid(uid)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<AvaliacaoModel> avaliacoes = service.listarPorUsuario(usuario.getId());

        if (avaliacoes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(avaliacoes);

    } catch (Exception e) {
        return ResponseEntity.status(404).body(null);
    }
}


}
