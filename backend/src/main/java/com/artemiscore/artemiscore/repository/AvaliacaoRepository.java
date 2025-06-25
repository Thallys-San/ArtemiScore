package com.artemiscore.artemiscore.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.artemiscore.artemiscore.model.AvaliacaoModel;

@Repository
public interface AvaliacaoRepository extends JpaRepository<AvaliacaoModel, Long>{}
