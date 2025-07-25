<<<<<<< HEAD
package com.artemiscore.artemiscore.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.AvaliacaoModel;
import com.artemiscore.artemiscore.service.AvaliacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService service;

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


    
    // ✅ Criar uma nova avaliação
    @PostMapping
    public ResponseEntity<AvaliacaoModel> criar(@Valid @RequestBody AvaliacaoModel avaliacaoModel) {
        AvaliacaoModel novaAvaliacao = service.salvar(avaliacaoModel);
        return ResponseEntity.ok(novaAvaliacao);
    }

    // ✅ Atualizar uma avaliação existente
    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoModel> editar(@PathVariable Long id, @Valid @RequestBody AvaliacaoModel avaliacaoModel) {
        if (!service.listarId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        avaliacaoModel.setId(id);
        AvaliacaoModel atualizada = service.salvar(avaliacaoModel);
        return ResponseEntity.ok(atualizada);
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
}
=======
package com.artemiscore.artemiscore.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.AvaliacaoModel;
import com.artemiscore.artemiscore.service.AvaliacaoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService service;

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


    
    // ✅ Criar uma nova avaliação
    @PostMapping
    public ResponseEntity<AvaliacaoModel> criar(@Valid @RequestBody AvaliacaoModel avaliacaoModel) {
        AvaliacaoModel novaAvaliacao = service.salvar(avaliacaoModel);
        return ResponseEntity.ok(novaAvaliacao);
    }

    // ✅ Atualizar uma avaliação existente
    @PutMapping("/{id}")
    public ResponseEntity<AvaliacaoModel> editar(@PathVariable Long id, @Valid @RequestBody AvaliacaoModel avaliacaoModel) {
        if (!service.listarId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        avaliacaoModel.setId(id);
        AvaliacaoModel atualizada = service.salvar(avaliacaoModel);
        return ResponseEntity.ok(atualizada);
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
}
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
