package com.artemiscore.artemiscore.repository;



import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import com.artemiscore.artemiscore.model.AvaliacaoModel;

@Repository
public interface AvaliacaoRepository extends JpaRepository<AvaliacaoModel, Long>{
    @Query("SELECT a FROM AvaliacaoModel a WHERE a.jogo_id = :jogoId")
    List<AvaliacaoModel> findAvaliacoesByJogoId(@Param("jogoId") Long jogoId);

    @Query("SELECT a FROM AvaliacaoModel a WHERE a.usuario_id = :usuarioId")
    List<AvaliacaoModel> findAvaliacoesByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT AVG(a.nota) FROM AvaliacaoModel a WHERE a.jogo_id = :jogoId")
    Double findMediaAvaliacaoByJogoId(@Param("jogoId") Long jogoId);

    @Query("SELECT a.jogo_id as jogoId, AVG(a.nota) as media " +
           "FROM AvaliacaoModel a " +
           "GROUP BY a.jogo_id " +
           "ORDER BY media DESC")
    Page<Object[]> findTopRatedGames(Pageable pageable);

    @Query("SELECT a.jogo_id, AVG(a.nota) as media " +
       "FROM AvaliacaoModel a " +
       "WHERE a.dataAvaliacao BETWEEN :startDate AND :endDate " +
       "GROUP BY a.jogo_id " +
       "ORDER BY media DESC")
Page<Object[]> findTopRatedGamesInPeriod(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

@Query("SELECT SUM(a.tempoDeJogo) FROM AvaliacaoModel a WHERE a.usuario_id = :usuarioId")
Long getTotalHorasPorUsuario(@Param("usuarioId") Long usuarioId);
}
