package com.example.backend.controller;

import com.example.backend.dto.TestCaseDTO;
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

    @PutMapping("/{id}")
    public ResponseEntity<TestCaseDTO> updateTestCase(@PathVariable Long id, @RequestBody TestCaseDTO testCaseDTO) {
        return ResponseEntity.ok(testCaseService.updateTestCase(id, testCaseDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTestCase(@PathVariable Long id) {
        testCaseService.deleteTestCase(id);
        return ResponseEntity.noContent().build();
    }
}
