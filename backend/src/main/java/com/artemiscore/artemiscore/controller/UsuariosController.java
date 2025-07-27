package com.artemiscore.artemiscore.controller;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.service.UsuariosService;



@RestController
@RequestMapping("/api/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosService service;

    @GetMapping
    public List<UsuariosModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuariosModel> listarId(@PathVariable Long id){
        return service.listarId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UsuariosModel cadastrar(@RequestBody UsuariosModel usuariosModel){
        return service.salvar(usuariosModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuariosModel> editar(@PathVariable Long id, @RequestBody UsuariosModel usuariosModel){
        if (!service.listarId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        usuariosModel.setId(id);
        return ResponseEntity.ok(service.salvar(usuariosModel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id){
        if (!service.listarId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

}
