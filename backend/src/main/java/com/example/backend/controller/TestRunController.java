package com.example.backend.controller;

import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.dto.TestRunDTO;
import com.example.backend.model.entity.TestResult;
import com.example.backend.model.entity.TestRun;
import com.example.backend.service.TestPlanService;
import com.example.backend.service.TestResultService;
import com.example.backend.service.TestRunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-run")
public class TestRunController {

    @Autowired
    private TestRunService testRunService;

    @Autowired
    private TestResultService testResultService;

    @PostMapping("/create/{testPlanId}")
    public ResponseEntity<TestRunDTO> createTestRun(@PathVariable Long testPlanId) {
        TestRunDTO testRunDTO = testRunService.createTestRun(testPlanId);
        return ResponseEntity.ok(testRunDTO);
    }

    @PutMapping("/result/{testResultId}/status")
    public ResponseEntity<TestResultDTO> updateTestResultStatus(
            @PathVariable Long testResultId,
            @RequestParam String status) {
        TestResultDTO testResultDTO = testResultService.updateTestResultStatus(testResultId, status);
        return ResponseEntity.ok(testResultDTO);
    }
}
