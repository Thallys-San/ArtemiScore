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

    public UsuariosModel salvar(UsuariosModel usuariosModel){
        String senha=usuariosModel.getSenha();

        if (usuariosModel.getData_criacao() == null) {
        usuariosModel.setData_criacao(LocalDate.now());
    }
        if (senha!= null && !senha.matches("^\\$2[abyx]\\$.{56}$")) {
         // Hasheia a senha antes de salvar
        String criptografia=passwordEncoder.encode(usuariosModel.getSenha());
        usuariosModel.setSenha(criptografia);
        }
        return repository.save(usuariosModel);
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
}
