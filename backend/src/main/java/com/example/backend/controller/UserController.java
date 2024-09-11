package com.example.backend.controller;

import com.example.backend.dto.ProfilesDto;
import com.example.backend.service.ProfilesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    @Autowired
    private ProfilesService profilesService;

    // Получение профиля пользователя через SecurityContext (ID из токена)
    @GetMapping("/profile")
    public ResponseEntity<ProfilesDto> getUserProfile() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return profilesService.getUserProfile(Long.parseLong(userId));
    }

    // Обновление профиля пользователя
    @PutMapping("/profile")
    public ResponseEntity<ProfilesDto> updateUserProfile(@RequestBody ProfilesDto profilesDto) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return profilesService.updateUserProfile(Long.parseLong(userId), profilesDto);
    }
}
