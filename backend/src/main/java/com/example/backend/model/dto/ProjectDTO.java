package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectDTO {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
