package com.artemiscore.artemiscore.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artemiscore.artemiscore.model.UsuariosModel;

@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosModel, Long>{}
