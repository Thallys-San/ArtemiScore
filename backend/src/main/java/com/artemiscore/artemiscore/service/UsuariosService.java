package com.artemiscore.artemiscore.service;



import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;


@Service
public class UsuariosService {
    @Autowired
    private UsuariosRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UsuariosModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<UsuariosModel> listarId(Long id){
        return repository.findById(id);
    }

public UsuariosModel salvar(UsuariosModel usuariosModel) {
    // Se for um novo usuário (sem ID), seta a data de criação
    if (usuariosModel.getId() == null && usuariosModel.getData_criacao() == null) {
        usuariosModel.setData_criacao(LocalDate.now());
    }
    
    // Verifica se a senha precisa ser criptografada
    if (usuariosModel.getSenha() != null && !isPasswordEncoded(usuariosModel.getSenha())) {
        String senhaCriptografada = passwordEncoder.encode(usuariosModel.getSenha());
        usuariosModel.setSenha(senhaCriptografada);
    }
    
    return repository.save(usuariosModel);
}

// Método auxiliar para verificar se a senha já está criptografada
private boolean isPasswordEncoded(String password) {
    return password.matches("^\\$2[abyx]\\$.{56}$");
}

    public void deletar(Long id){
        repository.deleteById(id);
    }

    public boolean emailExists(String email){
        return repository.existsByEmail(email);
    }

    public boolean usernameExists(String username){
        return repository.existsByNome(username);
    }

    public Optional<UsuariosModel> buscarPorEmail(String email){
        return repository.findByEmail(email);
    }

    public Optional<UsuariosModel> buscarPorUid(String uid) {
        return repository.findByUid(uid);
    }

    public void atualizarSenha(Long usuarioId, String novaSenha) {
    repository.findById(usuarioId).ifPresent(usuario -> {
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(usuario);
    });
}

public void atualizarSenhaPorUid(String uid, String novaSenha) {
    repository.findByUid(uid).ifPresent(usuario -> {
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(usuario);
    });
}

}
