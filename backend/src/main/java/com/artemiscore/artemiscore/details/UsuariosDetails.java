package com.artemiscore.artemiscore.details;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.artemiscore.artemiscore.model.UsuariosModel;

public class UsuariosDetails implements UserDetails{

    private final UsuariosModel usuariosModel;

    public UsuariosDetails(UsuariosModel usuariosModel1){
        this.usuariosModel=usuariosModel1;
    }
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

    @Override
    public boolean isAccountNonLocked(){
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired(){
        return true;
    }

    @Override
    public boolean isEnabled(){
        return true;
    }
}
