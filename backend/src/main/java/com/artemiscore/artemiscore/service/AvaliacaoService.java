package com.artemiscore.artemiscore.service;



import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;





import com.artemiscore.artemiscore.model.AvaliacaoModel;

import com.artemiscore.artemiscore.repository.AvaliacaoRepository;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository repository;

    @Autowired
    private RawgService rawgService;


    public List<AvaliacaoModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<AvaliacaoModel> listarId(Long id){
        return repository.findById(id);
    }

    public List<AvaliacaoModel> listarPorUsuario(Long usuarioId) {
        return repository.findAvaliacoesByUsuarioId(usuarioId);
    }

    public List<AvaliacaoModel> listarPorJogo(Long jogoId) {
        return repository.findAvaliacoesByJogoId(jogoId);
    }

    
    public AvaliacaoModel salvar(AvaliacaoModel avaliacaoModel) {
    Long jogoId = avaliacaoModel.getId();
    if (jogoId == null || rawgService.getGameById(jogoId) == null) {
        throw new IllegalArgumentException("Jogo inválido ou não encontrado: " + jogoId);
    }
    System.out.println("Salvando avaliação para jogo_id=" + jogoId);
    return repository.save(avaliacaoModel);
    }


    public void deletar(Long id){
        repository.deleteById(id);
    }
}
