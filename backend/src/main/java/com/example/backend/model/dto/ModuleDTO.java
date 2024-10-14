package com.example.backend.model.dto;

import lombok.Data;

@Data
public class ModuleDTO {
    private Long id;
    private String name;
    private Long parentId;
    private Long projectId;

}
