package com.artemiscore.artemiscore.config;

import java.io.IOException;

import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void init(){
        try {
            // Carrega o arquivo JSON da chave do Firebase
            FirebaseOptions options=FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(
                getClass().getResourceAsStream("/firebase/serviceAccountKey.json")
            ))
            .build();
            // Inicializa o FirebaseApp se ainda não foi inicializado
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (IOException e) {

            throw new RuntimeException("Erro ao inicializar o Firebase", e);
        }
    }
}
