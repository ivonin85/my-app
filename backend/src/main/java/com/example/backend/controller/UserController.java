package com.example.backend.controller;

import com.example.backend.dto.UsersDto;
import com.example.backend.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private UsersService usersService;

    // Получение профиля пользователя через SecurityContext (ID из токена)
    @GetMapping("/profile")
    public ResponseEntity<UsersDto> getUserProfile() {
        // Извлечение ID пользователя из SecurityContext
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // Вызов сервиса для получения информации о пользователе
        return usersService.getUserById(Long.parseLong(userId));
    }

}
