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
            .csrf(csfr -> csfr.disable()) // desativa CSRF para facilitar testes com Postman, por exemplo
            .authorizeHttpRequests(auth -> auth
            .requestMatchers("/login","/cadastro","/css/**","/js/**").permitAll() //rotas publicas
            .anyRequest().authenticated()// o resto precisa estar logado
            )
            .formLogin(form -> form
            .loginPage("login")// página personalizada de login
            .defaultSuccessUrl("home",true)// redireciona após login bem-sucedido
            .permitAll()
            )
            .logout(logout -> logout
            .logoutSuccessUrl("/login?logout")//redireciona apos logout
            .permitAll()
            );
            return http.build();
    }
}
