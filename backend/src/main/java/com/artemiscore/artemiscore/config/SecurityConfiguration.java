package com.artemiscore.artemiscore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
public class SecurityConfiguration {

    // Define o encoder de senha (mesmo que você já usa no UsuariosService)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Expõe o AuthenticationManager, necessário para autenticação no backend
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)throws Exception{
        return config.getAuthenticationManager();
    }

    // Define as regras de segurança (rotas públicas, privadas, login, etc)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
        // Define as rotas públicas
        .requestMatchers(
            "/login", 
            "/cadastro", 
            "/css/**", 
            "/js/**", 
            "/api/games/**",        
            "/avaliacoes/**",
            "/usuarios/**" 
            ).permitAll()
            .anyRequest().authenticated()
        )

        .formLogin(form -> form
            .loginPage("/login")                          
            .defaultSuccessUrl("/home", true)             
            .permitAll()
        )
        .logout(logout -> logout
            .logoutSuccessUrl("/login?logout")            
            .permitAll()
        );

    return http.build();
    }

}
