package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProfileDTO {
    private Long id;
    private Long userId;
    private String name;
    private String surname;
    private String patronymic;
    private String dateOfBirth;
    private String photoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
