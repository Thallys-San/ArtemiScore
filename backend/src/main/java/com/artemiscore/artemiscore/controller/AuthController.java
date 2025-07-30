package com.artemiscore.artemiscore.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.artemiscore.artemiscore.utils.JwtUtil;

import lombok.Getter;
import lombok.Setter;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtUtil jwtUtil;

    public AuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // Usuário fixo apenas para fins acadêmicos
        if ("admin".equals(request.getUsername()) && "1234".equals(request.getPassword())) {
            String token = jwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    }

    // Classe usada para receber o login (JSON com username e password)
    @Getter
    @Setter
    public static class AuthRequest {
        private String username;
        private String password;
    }

    // Classe usada para retornar o token (JSON com token)
    public static class AuthResponse {
        public String token;

        public AuthResponse(String token) {
            this.token = token;
        }
    }
}
