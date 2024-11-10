package com.example.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestRunDTO {
    private Long id;
    private Long testPlanId;
    private Long projectId;
    private String name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<TestResultDTO> testResults;
}
