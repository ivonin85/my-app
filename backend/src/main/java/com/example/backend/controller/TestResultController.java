package com.example.backend.controller;

import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.service.TestResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-results")
public class TestResultController {

    @Autowired
    private TestResultService testResultService;

    @PostMapping
    public ResponseEntity<TestResultDTO> saveTestResult(@RequestBody TestResultDTO testResultDTO) {
        TestResultDTO savedTestResult = testResultService.saveTestResult(testResultDTO);
        return ResponseEntity.ok(savedTestResult);
    }

    @GetMapping("/test-run/{testRunId}")
    public ResponseEntity<List<TestResultDTO>> getTestResultsByTestRunId(@PathVariable Long testRunId) {
        List<TestResultDTO> testResults = testResultService.getTestResultsByTestRunId(testRunId);
        return ResponseEntity.ok(testResults);
    }
}