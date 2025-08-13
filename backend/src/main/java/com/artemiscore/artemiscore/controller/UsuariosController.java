package com.artemiscore.artemiscore.controller;



import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.service.UsuariosService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;



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
        System.out.println("Recebi uma requisição de cadastro!");
        System.out.println(usuariosModel);
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

    // Verifica se o e-mail já está em uso
    @GetMapping("/check-email")
    public ResponseEntity<Map<String,Boolean>> checkEmailExists(@RequestParam String email){
        boolean exists = service.emailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    // Verifica se o username já está em uso
@GetMapping("/check-username")
public ResponseEntity<Map<String, Boolean>> checkUsernameExists(
        @RequestParam String username,
        @RequestParam(required = false) String currentUserId) {

    boolean exists = service.usernameExists(username);

    // Se o username existir, mas pertence ao currentUserId, então não considera como ocupado
    if (exists && currentUserId != null) {
        Optional<UsuariosModel> user = service.buscarPorUid(currentUserId);
        if (user.isPresent() && user.get().getNome().equalsIgnoreCase(username)) {
            exists = false; // O username é do próprio usuário, liberar
        }
    }

    Map<String, Boolean> response = new HashMap<>();
    response.put("exists", exists);
    response.put("available", !exists); // Adicione esta linha para consistência
    return ResponseEntity.ok(response);
}

    @GetMapping("/me")
    public ResponseEntity<UsuariosModel> getUsuarioLogado (Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String uid = authentication.getPrincipal().toString();
        return service.buscarPorUid(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

@PutMapping("/me")
public ResponseEntity<UsuariosModel> editarUsuarioLogado(@RequestBody UsuariosModel usuariosModel, Authentication authentication){
    if(authentication == null || !authentication.isAuthenticated()){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    String uid = authentication.getPrincipal().toString();
    return service.buscarPorUid(uid)
        .map(usuarioExistente -> {
            // Mantém a senha existente se não for fornecida
            if(usuariosModel.getSenha() == null) {
                usuariosModel.setSenha(usuarioExistente.getSenha());
            }
            
            // Atualiza apenas os campos permitidos
            usuarioExistente.setNome(usuariosModel.getNome());
            usuarioExistente.setEmail(usuariosModel.getEmail());
            usuarioExistente.setBio(usuariosModel.getBio());
            usuarioExistente.setFoto_perfil(usuariosModel.getFoto_perfil());
            usuarioExistente.setPreferencias_jogos(usuariosModel.getPreferencias_jogos());
            usuarioExistente.setPlataformas_utilizadas(usuariosModel.getPlataformas_utilizadas());
            
            UsuariosModel atualizado = service.salvar(usuarioExistente);
            return ResponseEntity.ok(atualizado);
        })
        .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
}

@DeleteMapping("/me")
public ResponseEntity<?> deletarUsuarioLogado(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String uid = authentication.getPrincipal().toString();

    return service.buscarPorUid(uid)
            .map(usuario -> {
                // Remove do banco local
                service.deletar(usuario.getId());

                // Remove também do Firebase
                try {
                    FirebaseAuth.getInstance().deleteUser(uid);
                } catch (FirebaseAuthException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }

                return ResponseEntity.noContent().build();
            })
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
}

@PostMapping("/update-password")
public ResponseEntity<?> updatePassword(
    @RequestBody Map<String, String> request,
    Authentication authentication) {
    
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String uid = authentication.getPrincipal().toString();
    String newPassword = request.get("newPassword");

    if (newPassword == null || newPassword.trim().isEmpty()) {
        return ResponseEntity.badRequest().body("Nova senha não pode ser vazia");
    }

    try {
        service.atualizarSenhaPorUid(uid, newPassword);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Erro ao atualizar senha");
    }
}


    @GetMapping("/me/favoritos")
public ResponseEntity<List<Long>> getFavoritosUsuarioLogado(Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String uid = authentication.getPrincipal().toString();
    return service.buscarPorUid(uid)
            .map(usuario -> ResponseEntity.ok(usuario.getJogosFavoritosList()))
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
}

@PostMapping("/me/favoritos")
public ResponseEntity<?> adicionarFavoritoUsuarioLogado(
        @RequestParam Long jogoId,
        Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String uid = authentication.getPrincipal().toString();
    try {
        service.adicionarJogoFavorito(uid, jogoId);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@DeleteMapping("/me/favoritos/{jogoId}")
public ResponseEntity<?> removerFavoritoUsuarioLogado(
        @PathVariable Long jogoId,
        Authentication authentication) {
    if (authentication == null || !authentication.isAuthenticated()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String uid = authentication.getPrincipal().toString();
    try {
        service.removerJogoFavorito(uid, jogoId);
        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

@GetMapping("/id/{id}")
public ResponseEntity<UsuariosModel> getUsuarioPorId(@PathVariable Long id) {
    return service.listarId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
}


}
