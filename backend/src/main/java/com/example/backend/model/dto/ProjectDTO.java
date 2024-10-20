package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ProjectDTO {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private Long ownerId;
    private Set<Long> memberIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
