package com.ArtemiScore.ArtemiScore.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ArtemiScore.ArtemiScore.model.UsuariosModel;
import com.ArtemiScore.ArtemiScore.repository.UsuariosRepository;


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
}
