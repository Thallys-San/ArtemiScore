package com.artemiscore.artemiscore.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.AvaliacaoRepository;
import com.artemiscore.artemiscore.service.UsuariosService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuariosController {

    @Autowired
    private UsuariosService service;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @GetMapping
    public List<UsuariosModel> listarTodos(){
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuariosModel> listarId(@PathVariable Long id){
        return service.listarId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{usuarioId}/horas")
    public ResponseEntity<Long> getTotalHorasPorUsuario(@PathVariable Long usuarioId) {
        Long totalHoras = avaliacaoRepository.getTotalHorasPorUsuario(usuarioId);
        if (totalHoras == null) totalHoras = 0L;
        return ResponseEntity.ok(totalHoras);
    }

    @GetMapping("/me")
    public ResponseEntity<UsuariosModel> getUsuarioLogado(Authentication authentication){
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String uid = authentication.getPrincipal().toString();
        return service.buscarPorUid(uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping("/me")
    public ResponseEntity<UsuariosModel> editarUsuarioLogado(@RequestBody UsuariosModel usuariosModel,
                                                             Authentication authentication){
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
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // ✅ Verificar se email existe
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestParam(required = true) String email){
        if(email == null || email.isEmpty()){
            Map<String, Boolean> response = new HashMap<>();
            response.put("exists", false);
            return ResponseEntity.badRequest().body(response);
        }

        boolean exists = service.emailExists(email);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    // ✅ Verificar se username existe
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameExists(
            @RequestParam(required = true) String username,
            @RequestParam(required = false) String currentUserId) {

        if(username == null || username.isEmpty()){
            Map<String, Boolean> response = new HashMap<>();
            response.put("exists", false);
            response.put("available", false);
            return ResponseEntity.badRequest().body(response);
        }

        boolean exists = service.usernameExists(username);

        if(exists && currentUserId != null){
            Optional<UsuariosModel> user = service.buscarPorUid(currentUserId);
            if(user.isPresent() && user.get().getNome().equalsIgnoreCase(username)){
                exists = false;
            }
        }

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        response.put("available", !exists);
        return ResponseEntity.ok(response);
    }

    @PostMapping
@ResponseStatus(HttpStatus.CREATED)
public ResponseEntity<UsuariosModel> cadastrar(@RequestBody UsuariosModel usuario) {
    if(usuario.getEmail() == null || usuario.getSenha() == null || usuario.getNome() == null){
        return ResponseEntity.badRequest().build();
    }

    UsuariosModel salvo = service.salvar(usuario);
    return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
}


    @DeleteMapping("/me")
    public ResponseEntity<?> deletarUsuarioLogado(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String uid = authentication.getPrincipal().toString();

        return service.buscarPorUid(uid)
                .map(usuario -> {
                    service.deletar(usuario.getId());
                    try {
                        FirebaseAuth.getInstance().deleteUser(uid);
                    } catch (FirebaseAuthException e) {
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    }
                    return ResponseEntity.noContent().build();
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/me/favoritos")
    public ResponseEntity<List<Long>> getFavoritosUsuarioLogado(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String uid = authentication.getPrincipal().toString();
        return service.buscarPorUid(uid)
                .map(usuario -> ResponseEntity.ok(usuario.getJogosFavoritosList()))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/me/favoritos")
    public ResponseEntity<?> adicionarFavoritoUsuarioLogado(@RequestParam Long jogoId,
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
    public ResponseEntity<?> removerFavoritoUsuarioLogado(@PathVariable Long jogoId,
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

    // Buscar outro usuário pelo UID
@GetMapping("/uid/{uid}")
public ResponseEntity<UsuariosModel> getUsuarioPorUid(@PathVariable String uid) {
    return service.buscarPorUid(uid)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
}

// Buscar favoritos de outro usuário pelo UID
@GetMapping("/{uid}/favoritos")
public ResponseEntity<List<Long>> getFavoritosOutroUsuario(@PathVariable String uid) {
    return service.buscarPorUid(uid)
            .map(usuario -> ResponseEntity.ok(usuario.getJogosFavoritosList()))
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
}

}
