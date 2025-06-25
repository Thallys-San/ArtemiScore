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

    public AvaliacaoModel salvar(AvaliacaoModel avaliacaoModel){
        if (avaliacaoModel.getJogo_id() == null || rawgService.getGameById(avaliacaoModel.getJogo_id()) == null) {
            throw new IllegalArgumentException("Jogo inválido ou não encontrado na API RAWG");
        }
        return repository.save(avaliacaoModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);
    }
}
