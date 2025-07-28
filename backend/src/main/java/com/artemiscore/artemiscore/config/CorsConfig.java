package com.artemiscore.artemiscore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            // Especifique as origens do seu frontend
            .allowedOriginPatterns("http://127.0.0.1:5500", "http://localhost:5500")
            // Métodos permitidos
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            // Cabeçalhos permitidos (pode restringir se quiser mais controle)
            .allowedHeaders("*")
            // Permitir cookies, tokens, etc.
            .allowCredentials(true)
            // Tempo de cache da política CORS (em segundos)
            .maxAge(3600);
    }
}
