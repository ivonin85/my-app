package com.example.backend.model.dto;

import lombok.Data;

@Data
public class TestResultDTO {
    private Long id;
    private Long testCaseId;
    private Long testRunId;
    private String status;
}
