package com.example.backend.controller;

import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.model.entity.TestPlan;
import com.example.backend.service.TestPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testplan")
public class TestPlanController {

    @Autowired
    private TestPlanService testPlanService;

    @PostMapping("/create")
    public ResponseEntity<TestPlanDTO> createTestPlan(@RequestBody TestPlanDTO testPlan) {
        TestPlanDTO testPlanDTO = testPlanService.createTestPlan(testPlan);
        return new ResponseEntity<>(testPlanDTO, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TestPlanDTO> getTestPlanById(@PathVariable Long id) {
        TestPlanDTO testPlanDTO = testPlanService.getTestPlanById(id);
        return new ResponseEntity<>(testPlanDTO, HttpStatus.OK);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TestPlanDTO>> getTestPlansByProjectId(@PathVariable Long projectId) {
        List<TestPlanDTO> testPlans = testPlanService.getTestPlansByProjectId(projectId);
        return new ResponseEntity<>(testPlans, HttpStatus.OK);
    }
}

