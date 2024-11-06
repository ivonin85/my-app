package com.example.backend.controller;

import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.dto.TestRunDTO;
import com.example.backend.service.TestResultService;
import com.example.backend.service.TestRunService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/test-run")
public class TestRunController {

    @Autowired
    private TestRunService testRunService;

    @Autowired
    private TestResultService testResultService;

    @PostMapping("/create/{testPlanId}")
    public ResponseEntity<TestRunDTO> createTestRun(
            @PathVariable Long testPlanId,
            @RequestBody Map<String, String> requestBody) {
        String testRunName = requestBody.get("name");
        TestRunDTO testRunDTO = testRunService.createTestRun(testPlanId, testRunName);
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
