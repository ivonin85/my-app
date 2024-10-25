package com.example.backend.model.dto;

import lombok.Data;

@Data
public class TagDTO {
    private Long id;
    private String name;
    private Long projectId;
}
