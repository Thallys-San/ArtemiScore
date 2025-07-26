package com.artemiscore.artemiscore.model.rawghApi;

import java.util.Map;

import lombok.Data;

@Data
public class ClipDTO {
    private String clip;  // URL principal do vídeo
    private Map<String, String> clips; // URLs em resoluções diferentes (chave: resolução, valor: URL)
    private String video; // URL do vídeo em tamanho full
    private String preview; // URL da imagem preview do vídeo
}
