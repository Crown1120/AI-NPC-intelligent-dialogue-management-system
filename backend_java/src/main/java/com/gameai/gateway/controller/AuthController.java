package com.gameai.gateway.controller;

import com.gameai.gateway.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final JwtService jwtService;

    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        if ("admin".equals(credentials.get("username")) && "admin123".equals(credentials.get("password"))) {
            String token = jwtService.generateToken("admin");
            return ResponseEntity.ok(Map.of("token", token, "tokenType", "Bearer", "username", "admin"));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
