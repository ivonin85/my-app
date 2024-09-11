package com.example.backend.repository;

import com.example.backend.model.Profiles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfilesRepository extends JpaRepository<Profiles, Long> {
    // Метод для поиска профиля по ID пользователя
    Optional<Profiles> findByUserId(Long userId);
}
