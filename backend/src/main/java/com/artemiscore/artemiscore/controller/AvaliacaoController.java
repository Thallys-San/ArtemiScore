package com.artemiscore.artemiscore.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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



@RestController
@RequestMapping("/avaliacoes")
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
    public ResponseEntity<?> cadastrar(@RequestBody AvaliacaoModel avaliacaoModel) {
        try {
            AvaliacaoModel salva = service.salvar(avaliacaoModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(salva);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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


