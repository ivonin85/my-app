package com.example.backend.controller;

import com.example.backend.dto.ProfileDTO;
import com.example.backend.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private ProfileService profilesService;

    // Получение профиля пользователя через SecurityContext (ID из токена)
    @GetMapping("/profile")
    public ResponseEntity<ProfileDTO> getUserProfile() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return profilesService.getUserProfile(Long.parseLong(userId));
    }

    // Обновление профиля пользователя
    @PutMapping("/profile")
    public ResponseEntity<ProfileDTO> updateUserProfile(@RequestBody ProfileDTO profilesDto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return profilesService.updateUserProfile(Long.parseLong(userId), profilesDto);
    }
}
