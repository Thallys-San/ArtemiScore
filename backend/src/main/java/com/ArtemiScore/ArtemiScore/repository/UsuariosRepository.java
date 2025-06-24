package com.ArtemiScore.ArtemiScore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ArtemiScore.ArtemiScore.Model.UsuariosModel;



@Repository
public interface UsuariosRepository extends JpaRepository<UsuariosModel, Long>{}
