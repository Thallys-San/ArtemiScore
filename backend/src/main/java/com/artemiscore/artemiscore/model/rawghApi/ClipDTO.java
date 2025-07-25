<<<<<<< HEAD
package com.artemiscore.artemiscore.model.rawghApi;

import lombok.Data;
import java.util.Map;

@Data
public class ClipDTO {
    private String clip;  // URL principal do vídeo
    private Map<String, String> clips; // URLs em resoluções diferentes (chave: resolução, valor: URL)
    private String video; // URL do vídeo em tamanho full
    private String preview; // URL da imagem preview do vídeo
}
=======
package com.artemiscore.artemiscore.model.rawghApi;

import lombok.Data;
import java.util.Map;

@Data
public class ClipDTO {
    private String clip;  // URL principal do vídeo
    private Map<String, String> clips; // URLs em resoluções diferentes (chave: resolução, valor: URL)
    private String video; // URL do vídeo em tamanho full
    private String preview; // URL da imagem preview do vídeo
}
>>>>>>> b4e1ade8e278a2882918ea5fbbdc3f3bb2e43e60
