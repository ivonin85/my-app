package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.UsersDto;
import com.example.backend.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UsersDto usersDto) {
        return usersService.register(usersDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        return usersService.login(authRequest);
    }
}