package com.example.backend.service;

import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.entity.TestResult;
import com.example.backend.model.entity.TestRun;
import com.example.backend.repository.TestPlanRepository;
import com.example.backend.repository.TestResultRepository;
import com.example.backend.repository.TestRunRepository;
import com.example.backend.service.mapper.TestResultMapper;
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

    public TestResultDTO saveTestResult(TestResultDTO testResultDTO) {
        TestRun testRun = testRunRepository.findById(testResultDTO.getTestRunId())
                .orElseThrow(() -> new RuntimeException("Тест-ран не найден"));

        TestResult testResult = TestResultMapper.INSTANCE.testResultToEntity(testResultDTO);
        testResult.setTestRun(testRun);

        TestResult savedTestResult = testResultRepository.save(testResult);
        return TestResultMapper.INSTANCE.testResultToDTO(savedTestResult);
    }

    public List<TestResultDTO> getTestResultsByTestRunId(Long testRunId) {
        List<TestResult> testResults = testResultRepository.findByTestRunId(testRunId);
        return testResults.stream()
                .map(TestResultMapper.INSTANCE::testResultToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public TestResultDTO updateTestResultStatus(Long testResultId, String status) {
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new RuntimeException("Test result not found"));

        testResult.setStatus(status);
        TestResult updatedTestResult = testResultRepository.save(testResult);
        return TestResultMapper.INSTANCE.testResultToDTO(updatedTestResult);
    }
}


