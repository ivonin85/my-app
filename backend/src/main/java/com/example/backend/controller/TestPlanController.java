package com.example.backend.controller;

import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.service.TestPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/testplan")
public class TestPlanController {

    @Autowired
    private TestPlanService testPlanService;

    @PostMapping("/create")
    public ResponseEntity<TestPlanDTO> createTestPlan(@RequestBody TestPlanDTO testPlan) {
        TestPlanDTO testPlanDTO = testPlanService.createTestPlan(testPlan.getName(), testPlan.getModuleIds(), testPlan.getTagIds());
        return new ResponseEntity<>(testPlanDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestPlanDTO> getTestPlanById(@PathVariable Long id) {
        TestPlanDTO testPlanDTO = testPlanService.getTestPlanById(id);
        return new ResponseEntity<>(testPlanDTO, HttpStatus.OK);
    }
}

