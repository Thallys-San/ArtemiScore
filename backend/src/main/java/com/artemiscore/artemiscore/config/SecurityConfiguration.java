package com.artemiscore.artemiscore.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.artemiscore.artemiscore.utils.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtFilter) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Habilita o CORS
        .csrf(csrf -> csrf.disable()) // Desativa proteção CSRF (porque usamos JWT)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(
                "/api/auth/**",        // Rota pública para login
                "/api/usuarios/**",    // Rota temporariamente pública para cadastro
                "/css/**",             // Frontend
                "/js/**",              // Frontend
                "/api/games/**",       // Exemplo de endpoint público
                "/avaliacoes/**",      // Exemplo
                "/error"               // Rota padrão de erro
            ).permitAll()
            .anyRequest().authenticated() // Todas as outras rotas precisam de token
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Não cria sessão (stateless)
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class); // Usa o filtro de JWT ANTES do filtro padrão de login

    return http.build();
}


    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:3005"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("Content-Type", "Authorization", "X-XSRF-TOKEN"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}

}