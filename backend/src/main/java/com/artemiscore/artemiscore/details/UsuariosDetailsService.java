package com.artemiscore.artemiscore.details;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;

@Service
public class UsuariosDetailsService implements UserDetailsService{

    @Autowired
    private UsuariosRepository repository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        Optional<UsuariosModel> usuario=repository.findByEmail(email);
        if(usuario.isEmpty()){  
            throw new UsernameNotFoundException("Usuário não encontrado com e-mail:"+email);
        }
        return new UsuariosDetails(usuario.get());
    }

}