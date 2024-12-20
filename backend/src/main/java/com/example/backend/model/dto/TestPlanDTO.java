package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestPlanDTO {
    private Long id;
    private String name;
    private List<Long> moduleIds;
    private List<Long> tagIds;
    private List<TestCaseDTO> testCases;
    private Long projectId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
