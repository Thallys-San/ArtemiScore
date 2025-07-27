package com.artemiscore.artemiscore.utils;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component // Filtro gerenciado pelo Spring
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Lê o cabeçalho Authorization
        String header = request.getHeader("Authorization");

        // Verifica se o token começa com "Bearer "
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // Remove o "Bearer "

            // Se o token for válido, autentica o usuário
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token); // Extrai o usuário

                // Cria a autenticação do Spring (aqui não estamos usando roles por simplicidade)
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, null);

                // Define os detalhes da requisição
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Registra a autenticação no contexto de segurança
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continua o fluxo da requisição
        filterChain.doFilter(request, response);
    }
}
