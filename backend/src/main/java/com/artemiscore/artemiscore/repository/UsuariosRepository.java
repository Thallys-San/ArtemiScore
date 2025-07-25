<<<<<<< HEAD
package com.artemiscore.artemiscore.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artemiscore.artemiscore.model.UsuariosModel;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosModel, Long>{
    // Método customizado para buscar um usuário pelo e-mail
    Optional<UsuariosModel> findByEmail(String email);
}
=======
package com.artemiscore.artemiscore.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artemiscore.artemiscore.model.UsuariosModel;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosModel, Long>{
    // Método customizado para buscar um usuário pelo e-mail
    Optional<UsuariosModel> findByEmail(String email);
}
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
