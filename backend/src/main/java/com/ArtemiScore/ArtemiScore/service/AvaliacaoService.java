package com.ArtemiScore.ArtemiScore.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ArtemiScore.ArtemiScore.model.AvaliacaoModel;
import com.ArtemiScore.ArtemiScore.repository.AvaliacaoRepository;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository repository;

    public List<AvaliacaoModel> listarTodos(){
        return repository.findAll();
    }

    public Optional<AvaliacaoModel> listarId(Long id){
        return repository.findById(id);
    }

    public AvaliacaoModel salvar(AvaliacaoModel avaliacaoModel){
        return repository.save(avaliacaoModel);
    }

    public void deletar(Long id){
        repository.deleteById(id);
    }
}
