package com.artemiscore.artemiscore.details;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.artemiscore.artemiscore.model.UsuariosModel;

// Essa classe adapta o modelo de usuário para o formato que o Spring Security entende
public class UsuariosDetails implements UserDetails{

    private final UsuariosModel usuariosModel; // Guarda o usuário original

    public UsuariosDetails(UsuariosModel usuariosModel1){
        this.usuariosModel=usuariosModel1;
    }
    
    // retorna os papéis (roles) do usuário
    // Como ainda não há controle de perfis, retorna uma lista vazia
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return Collections.emptyList();
    }

    // Retorna a senha do usuário (já criptografada no banco)
    @Override
    public String getPassword(){
        return usuariosModel.getSenha();
    }

    // Retorna o identificador de login, que é o e-mail no seu caso
    @Override
    public String getUsername(){
        return usuariosModel.getEmail();
    }

    //conta nao expirada
    @Override
    public boolean isAccountNonExpired(){
        return true;
    }

    // Conta não bloqueada
    @Override
    public boolean isAccountNonLocked(){
        return true;
    }

    // Credenciais não expiradas
    @Override
    public boolean isCredentialsNonExpired(){
        return true;
    }

    // Conta está ativa
    @Override
    public boolean isEnabled(){
        return true;
    }
}
