package com.ArtemiScore.ArtemiScore.controller;

import java.util.List;

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

import com.ArtemiScore.ArtemiScore.model.AvaliacaoModel;
import com.ArtemiScore.ArtemiScore.service.AvaliacaoService;

@RestController
@RequestMapping("/avaliações")
@CrossOrigin(origins = "*")
public class AvaliacaoController {

    @Autowired
    private AvaliacaoService service;

    @GetMapping
    public List<AvaliacaoModel> listarTodos(){
        return service.listarTodos();
    }
    @GetMapping("/{usuarios_id}")
    public ResponseEntity<AvaliacaoModel> listarId(@PathVariable Long usuarios_id){
        return service.listarId(usuarios_id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AvaliacaoModel cadastrar(@RequestBody AvaliacaoModel AvaliacaoModel){
        return service.salvar(AvaliacaoModel);
    }
    @PutMapping("/{usuarios_id}")
    public ResponseEntity<AvaliacaoModel> editar(@PathVariable Long usuarios_id, @RequestBody AvaliacaoModel avaliacaoModel){
        if (!service.listarId(usuarios_id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        avaliacaoModel.setId(usuarios_id);
        return ResponseEntity.ok(service.salvar(avaliacaoModel));
    }

    @DeleteMapping("/{usuarioos_id}")
    public ResponseEntity<Void> deletar(Long usuarios_id){
        if (!service.listarId(usuarios_id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(usuarios_id);
        return ResponseEntity.noContent().build();
    }
    }


