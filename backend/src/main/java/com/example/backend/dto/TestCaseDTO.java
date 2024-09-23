package com.example.backend.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestCaseDTO {
    private Long id;
    private String title;
    private String description;
    private String preconditions;
    private List<TestStepDTO> steps;
    private String priority;
    private String severity;
    private String status;
    private String requirements;
    private String comments;
    private List<String> tags;
    private Long executorId;
    private Long moduleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
