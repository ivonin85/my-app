package com.example.backend.service;

import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.dto.TestRunDTO;
import com.example.backend.model.entity.TestCase;
import com.example.backend.model.entity.TestPlan;
import com.example.backend.model.entity.TestResult;
import com.example.backend.model.entity.TestRun;
import com.example.backend.repository.TestResultRepository;
import com.example.backend.repository.TestRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestRunService {

    @Autowired
    private TestRunRepository testRunRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    public TestRunDTO createTestRun(Long testPlanId, String testRunName) {
        TestRun testRun = new TestRun();
        testRun.setName(testRunName);
        testRun.setTestPlan(new TestPlan());
        testRun.getTestPlan().setId(testPlanId);

        TestRun savedTestRun = testRunRepository.save(testRun);
        return toTestRunDTO(savedTestRun);
    }

    public TestRunDTO completeTestRun(Long testRunId) {
        TestRun testRun = testRunRepository.findById(testRunId)
                .orElseThrow(() -> new RuntimeException("TestRun not found"));

        TestRun completedTestRun = testRunRepository.save(testRun);
        return toTestRunDTO(completedTestRun);
    }

    public TestResultDTO saveTestResult(Long testRunId, Long testCaseId, String status, String comments) {
        TestRun testRun = testRunRepository.findById(testRunId)
                .orElseThrow(() -> new RuntimeException("TestRun not found"));

        TestResult testResult = new TestResult();
        testResult.setTestRun(testRun);
        testResult.setTestCase(new TestCase());
        testResult.getTestCase().setId(testCaseId);
        testResult.setStatus(status);

        TestResult savedTestResult = testResultRepository.save(testResult);
        return toTestResultDTO(savedTestResult);
    }

    public List<TestResultDTO> getTestResultsByTestRun(Long testRunId) {
        List<TestResult> testResults = testResultRepository.findByTestRunId(testRunId);
        return testResults.stream()
                .map(this::toTestResultDTO)
                .collect(Collectors.toList());
    }

    private TestRunDTO toTestRunDTO(TestRun testRun) {
        TestRunDTO dto = new TestRunDTO();
        dto.setId(testRun.getId());
        dto.setTestPlanId(testRun.getTestPlan().getId());

        List<TestResultDTO> testResultDTOs = testRun.getTestResults()
                .stream()
                .map(this::toTestResultDTO)
                .collect(Collectors.toList());

        dto.setTestResults(testResultDTOs);
        dto.setCreatedAt(testRun.getCreatedAt());
        dto.setUpdatedAt(testRun.getUpdatedAt());
        dto.setName(testRun.getName());

        return dto;
    }
    
    private TestResultDTO toTestResultDTO(TestResult testResult) {
        TestResultDTO dto = new TestResultDTO();
        dto.setId(testResult.getId());
        dto.setTestRunId(testResult.getTestRun().getId());
        dto.setTestCaseId(testResult.getTestCase().getId());
        dto.setStatus(testResult.getStatus());
        return dto;
    }
}



