package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TestRunDTO {
    private Long id;
    private Long testPlanId;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TestResultDTO> testResults;
}
