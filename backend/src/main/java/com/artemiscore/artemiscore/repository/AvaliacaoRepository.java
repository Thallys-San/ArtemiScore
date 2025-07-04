package com.artemiscore.artemiscore.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.artemiscore.artemiscore.model.AvaliacaoModel;

@Repository
public interface AvaliacaoRepository extends JpaRepository<AvaliacaoModel, Long>{
    @Query("SELECT a FROM AvaliacaoModel a WHERE a.jogo_id = :jogoId")
    List<AvaliacaoModel> findAvaliacoesByJogoId(@Param("jogoId") Long jogoId);
  
}
