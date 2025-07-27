package com.artemiscore.artemiscore.utils;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
// Chave secreta para assinar os tokens (em produção, use algo seguro e externo)
private static final String SECRET_KEY="g54*shg8HHJkLK9087!bdK&6723vGbfKjsd89g7fhlsdkJSKDSLsf834jdfg9234hfs";
// Tempo de expiração do token: 1 dia (em milissegundos)
private static final long EXPIRATION_MS=86400000;

// Gera uma chave de assinatura segura usando HMAC e SHA
private Key getSigningKey(){
    return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
}

// Gera um token com base no nome de usuário
public String generateToken(String username){
    return Jwts.builder()
    .setSubject(username)// Define o "dono" do token
    .setIssuedAt(new Date())// Data de emissão
    .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION_MS)) // Expiração
    .signWith(getSigningKey(),SignatureAlgorithm.HS512) // Algoritmo de assinatura
    .compact();// Gera o token JWT final como String
}

// Extrai o nome de usuário (subject) do token
public String extractUsername(String token){
    return Jwts.parserBuilder()
    .setSigningKey(getSigningKey())
    .build()
    .parseClaimsJws(token)
    .getBody()
    .getSubject();
}

// Verifica se o token é válido
public boolean validateToken(String token){
    try{
        Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
        return true;
    }catch(JwtException e){
        return false; // Token inválido ou expirado
    }
}
}
