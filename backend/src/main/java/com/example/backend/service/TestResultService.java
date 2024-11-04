package com.example.backend.service;

import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.dto.TestRunDTO;
import com.example.backend.model.entity.TestCase;
import com.example.backend.model.entity.TestPlan;
import com.example.backend.model.entity.TestResult;
import com.example.backend.model.entity.TestRun;
import com.example.backend.repository.TestPlanRepository;
import com.example.backend.repository.TestResultRepository;
import com.example.backend.repository.TestRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestResultService {

    @Autowired
    private TestRunRepository testRunRepository;

    @Autowired
    private TestPlanRepository testPlanRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Transactional
    public TestRunDTO createTestRun(Long testPlanId) {
        TestPlan testPlan = testPlanRepository.findById(testPlanId)
                .orElseThrow(() -> new RuntimeException("Test plan not found"));

        TestRun testRun = new TestRun();
        testRun.setTestPlan(testPlan);

        TestRun savedTestRun = testRunRepository.save(testRun);

        // Создаем пустые результаты для каждого тест-кейса
        List<TestResult> testResults = testPlan.getTestCases().stream()
                .map(testCase -> createEmptyTestResultEntity(testCase, savedTestRun))
                .collect(Collectors.toList());

        savedTestRun.setTestResults(testResults);
        return mapToTestRunDTO(savedTestRun);
    }

    public TestRunDTO getTestRun(Long testRunId) {
        TestRun testRun = testRunRepository.findById(testRunId)
                .orElseThrow(() -> new RuntimeException("Test run not found"));
        return mapToTestRunDTO(testRun);
    }

    @Transactional
    public TestResultDTO createEmptyTestResult(TestCase testCase, TestRun testRun) {
        TestResult testResult = createEmptyTestResultEntity(testCase, testRun);
        return mapToTestResultDTO(testResult);
    }

    @Transactional
    public TestResultDTO updateTestResultStatus(Long testResultId, String status) {
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new RuntimeException("Test result not found"));

        testResult.setStatus(status);

        TestResult updatedTestResult = testResultRepository.save(testResult);
        return mapToTestResultDTO(updatedTestResult);
    }

    // Вспомогательный метод для создания пустого тест-результата
    private TestResult createEmptyTestResultEntity(TestCase testCase, TestRun testRun) {
        TestResult testResult = new TestResult();
        testResult.setTestCase(testCase);
        testResult.setTestRun(testRun);
        testResult.setStatus("Pending");
        //testResult.setExecutedAt(null);
        return testResultRepository.save(testResult);
    }

    // Методы маппинга

    private TestRunDTO mapToTestRunDTO(TestRun testRun) {
        TestRunDTO dto = new TestRunDTO();
        dto.setId(testRun.getId());
        dto.setTestPlanId(testRun.getTestPlan().getId());
        dto.setTestResults(testRun.getTestResults().stream()
                .map(this::mapToTestResultDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    private TestResultDTO mapToTestResultDTO(TestResult testResult) {
        TestResultDTO dto = new TestResultDTO();
        dto.setId(testResult.getId());
        dto.setTestRunId(testResult.getTestRun().getId());
        dto.setTestCaseId(testResult.getTestCase().getId());
        dto.setStatus(testResult.getStatus());
        return dto;
    }
}


