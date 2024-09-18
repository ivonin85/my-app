package com.example.backend.repository;

import com.example.backend.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    // Метод для поиска профиля по ID пользователя
    Optional<Profile> findByUserId(Long userId);
}
