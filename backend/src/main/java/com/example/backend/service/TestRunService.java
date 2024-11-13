package com.example.backend.service;

import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.dto.TestRunDTO;
import com.example.backend.model.entity.*;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.TestCaseRepository;
import com.example.backend.repository.TestResultRepository;
import com.example.backend.repository.TestRunRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TestRunService {

    @Autowired
    private TestRunRepository testRunRepository;
    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private TestPlanService testPlanService;

    @Autowired
    private ProjectRepository projectRepository;

    public TestRunDTO createTestRun(Long testPlanId, String testRunName, Long projectId) {
        // Создаем новый объект TestRun
        TestRun testRun = new TestRun();
        testRun.setName(testRunName);
        testRun.setTestPlan(new TestPlan());
        testRun.getTestPlan().setId(testPlanId);

        // Получаем проект по projectId
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Проект с id " + projectId + " не найден"));
        testRun.setProject(project);

        // Сохраняем тест-ран
        TestRun savedTestRun = testRunRepository.save(testRun);

        // Получаем сгруппированные тест-кейсы
        Map<String, Map<String, List<TestCaseDTO>>> groupedTestCases = testPlanService.getTestCasesGroupedByModuleAndTag(testPlanId);

        // Создаем пустые сущности TestResult для каждого тест-кейса
        groupedTestCases.values().forEach(tagsMap -> {
            tagsMap.values().forEach(testCases -> {
                for (TestCaseDTO testCaseDTO : testCases) {
                    TestResult testResult = new TestResult();
                    testResult.setTestRun(savedTestRun);
                    testResult.setTestCase(new TestCase());
                    testResult.getTestCase().setId(testCaseDTO.getId());
                    testResult.setStatus("Untested");
                    testResultRepository.save(testResult);
                }
            });
        });

        return toTestRunDTO(savedTestRun);
    }



    public List<TestRunDTO> getTestRunByProjectId(Long projectId) {
        List<TestRun> testRuns = testRunRepository.findByProjectId(projectId);
        return testRuns.stream()
                .map(testRun -> new TestRunDTO(
                        testRun.getId(),
                        testRun.getTestPlan().getId(),
                        testRun.getProject().getId(),
                        testRun.getName(),
                        testRun.getCreatedAt(),
                        testRun.getUpdatedAt(),
                        convertTestResultsToDto(testRun.getTestResults())
                ))
                .collect(Collectors.toList());
    }

    private List<TestResultDTO> convertTestResultsToDto(List<TestResult> testResults) {
        return testResults.stream()
                .map(testResult -> new TestResultDTO(
                        testResult.getId(),
                        testResult.getTestCase().getId(),
                        testResult.getTestRun().getId(),
                        testResult.getStatus()
                ))
                .collect(Collectors.toList());
    }

    public TestRunDTO completeTestRun(Long testRunId) {
        TestRun testRun = testRunRepository.findById(testRunId)
                .orElseThrow(() -> new RuntimeException("TestRun not found"));

        TestRun completedTestRun = testRunRepository.save(testRun);
        return toTestRunDTO(completedTestRun);
    }

    private TestRunDTO toTestRunDTO(TestRun testRun) {
        TestRunDTO dto = new TestRunDTO();
        dto.setId(testRun.getId());
        dto.setTestPlanId(testRun.getTestPlan().getId());
        dto.setProjectId(testRun.getProject().getId());

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



