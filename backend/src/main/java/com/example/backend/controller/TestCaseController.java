package com.example.backend.controller;

import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.service.TestCaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testcases")
public class TestCaseController {

    @Autowired
    private TestCaseService testCaseService;

    @PostMapping
    public ResponseEntity<TestCaseDTO> createTestCase(@RequestBody TestCaseDTO testCaseDTO) {
        return ResponseEntity.ok(testCaseService.createTestCase(testCaseDTO));
    }

    @GetMapping("/module/{moduleId}")
    public ResponseEntity<List<TestCaseDTO>> getTestCasesByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(testCaseService.getTestCasesByModule(moduleId));
    }

    // Получение тест-кейса по ID для просмотра или редактирования
    @GetMapping("/{testCaseId}")
    public ResponseEntity<TestCaseDTO> getTestCaseById(@PathVariable Long testCaseId) {
        TestCaseDTO testCase = testCaseService.getTestCaseById(testCaseId);
        return ResponseEntity.ok(testCase);
    }

    @PutMapping("/{testCaseId}")
    public ResponseEntity<TestCaseDTO> updateTestCase(@PathVariable Long testCaseId, @RequestBody TestCaseDTO testCaseDTO) {
        return ResponseEntity.ok(testCaseService.updateTestCase(testCaseId, testCaseDTO));
    }

    @DeleteMapping("/{testCaseId}")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long testCaseId) {
        testCaseService.deleteTestCase(testCaseId);
        return ResponseEntity.noContent().build();
    }
}
