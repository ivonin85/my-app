package com.example.backend.model.dto;

import lombok.Data;

@Data
public class ProjectDTO {
    private Long id;
    private Long userId;
    private String title;
    private String description;

}
