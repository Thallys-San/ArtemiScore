<<<<<<< HEAD
package com.artemiscore.artemiscore.details;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;

// Essa classe é usada pelo Spring Security para carregar usuários do banco de dados
@Service
public class UsuariosDetailsService implements UserDetailsService{

    @Autowired
    private UsuariosRepository repository;

    // Método chamado automaticamente pelo Spring Security quando alguém tenta fazer login
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        // Busca o usuário no banco usando o e-mail
        Optional<UsuariosModel> usuario=repository.findByEmail(email);
        // Se não encontrar, lança exceção
        if(usuario.isEmpty()){  
            throw new UsernameNotFoundException("Usuário não encontrado com e-mail:"+email);
        }
        // Se encontrar, retorna um objeto do tipo UserDetails (adaptado pela classe UsuarioDetails)
        return new UsuariosDetails(usuario.get());
    }

}
=======
package com.artemiscore.artemiscore.details;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.artemiscore.artemiscore.model.UsuariosModel;
import com.artemiscore.artemiscore.repository.UsuariosRepository;

// Essa classe é usada pelo Spring Security para carregar usuários do banco de dados
@Service
public class UsuariosDetailsService implements UserDetailsService{

    @Autowired
    private UsuariosRepository repository;

    // Método chamado automaticamente pelo Spring Security quando alguém tenta fazer login
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        // Busca o usuário no banco usando o e-mail
        Optional<UsuariosModel> usuario=repository.findByEmail(email);
        // Se não encontrar, lança exceção
        if(usuario.isEmpty()){  
            throw new UsernameNotFoundException("Usuário não encontrado com e-mail:"+email);
        }
        // Se encontrar, retorna um objeto do tipo UserDetails (adaptado pela classe UsuarioDetails)
        return new UsuariosDetails(usuario.get());
    }

}
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
