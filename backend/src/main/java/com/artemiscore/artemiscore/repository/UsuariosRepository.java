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
