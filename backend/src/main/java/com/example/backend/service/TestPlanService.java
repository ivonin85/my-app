package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.entity.Tag;
import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.model.entity.TestCase;
import com.example.backend.model.entity.TestPlan;
import com.example.backend.repository.TestCaseRepository;
import com.example.backend.repository.TestPlanRepository;
import com.example.backend.service.mapper.TestPlanMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TestPlanService {

    @Autowired
    private TestPlanRepository testPlanRepository;

    @Autowired
    private TestCaseService testCaseService;

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private TestPlanMapper testPlanMapper;


    public TestPlanDTO createTestPlan(TestPlanDTO testPlanRequestBody) {
        TestPlan testPlan = new TestPlan();
        testPlan.setName(testPlanRequestBody.getName());
        testPlan.setModuleIds(testPlanRequestBody.getModuleIds());
        testPlan.setTagIds(testPlanRequestBody.getTagIds());
        testPlan.setProjectId(testPlanRequestBody.getProjectId());

        Set<TestCase> testCases = new HashSet<>();

        // Получаем тест-кейсы по модулям
        for (Long moduleId : testPlanRequestBody.getModuleIds()) {
            List<TestCaseDTO> moduleTestCaseDTOs = testCaseService.getTestCasesByModule(moduleId);
            List<TestCase> moduleTestCases = moduleTestCaseDTOs.stream()
                    .map(testCaseService::mapToEntity)
                    .toList();
            testCases.addAll(moduleTestCases);
        }

        // Получаем тест-кейсы по тегам
        for (Long tagId : testPlanRequestBody.getTagIds()) {
            List<TestCaseDTO> tagTestCaseDTOs = testCaseService.getTestCasesByTag(tagId);
            List<TestCase> tagTestCases = tagTestCaseDTOs.stream()
                    .map(testCaseService::mapToEntity)
                    .toList();
            testCases.addAll(tagTestCases);
        }

        // Устанавливаем тест-кейсы в тест-план
        testPlan.setTestCases(new ArrayList<>(testCases));
        TestPlan savedTestPlan = testPlanRepository.save(testPlan);

        testPlanToDTO(savedTestPlan);

        return testPlanToDTO(savedTestPlan);
    }

    public TestPlanDTO getTestPlanById(Long id) {
        TestPlan testPlan = testPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test Plan not found"));
        return testPlanMapper.toDTO(testPlan);
    }

    public List<TestPlanDTO> getTestPlansByProjectId(Long projectId) {
        List<TestPlan> testPlans = testPlanRepository.findByProjectId(projectId);
        return testPlanMapper.toDTOList(testPlans);
    }

    public Map<String, Map<String, List<TestCaseDTO>>> getTestCasesGroupedByModuleAndTag(Long testPlanId) {
        // Получаем тест-план по ID
        TestPlan testPlan = testPlanRepository.findById(testPlanId)
                .orElseThrow(() -> new EntityNotFoundException("TestPlan not found with id: " + testPlanId));

        // Получаем список тест-кейсов из тест-плана
        List<TestCase> testCases = testPlan.getTestCases();

        // Группируем тест-кейсы по модулям и тегам
        Map<String, Map<String, List<TestCaseDTO>>> groupedTestCases = new HashMap<>();

        for (TestCase testCase : testCases) {
            // Получаем имя модуля
            String moduleName = testCase.getModule() != null ? testCase.getModule().getName() : "No Module";

            // Получаем список тегов тест-кейса
            List<String> tagNames = testCase.getTags().stream()
                    .map(Tag::getName)
                    .toList();

            // Преобразуем TestCase в TestCaseDTO
            // TestCaseDTO testCaseDTO = testCaseService.mapToDTO(testCase);

            TestCaseDTO testCaseDTO = new TestCaseDTO();
            testCaseDTO.setId(testCase.getId());
            testCaseDTO.setTitle(testCase.getTitle());
            testCaseDTO.setPriority(testCase.getPriority());

            // Группируем по модулю
            groupedTestCases.computeIfAbsent(moduleName, k -> new HashMap<>());

            // Группируем по тегам внутри модуля
            for (String tagName : tagNames) {
                groupedTestCases.get(moduleName)
                        .computeIfAbsent(tagName, k -> new ArrayList<>())
                        .add(testCaseDTO);
            }
        }

        return groupedTestCases;
    }



    /*private TestPlanDTO testPlanToDTO(TestPlan testPlan) {
        if (testPlan == null) {
            return null;
        }

        TestPlanDTO testPlanDTO = new TestPlanDTO();
        testPlanDTO.setId(testPlan.getId());
        testPlanDTO.setName(testPlan.getName());
        testPlanDTO.setTagIds(testPlan.getTagIds());
        testPlanDTO.setModuleIds(testPlan.getModuleIds());
        testPlanDTO.setProjectId(testPlan.getProjectId());

        List<TestCaseDTO> testCaseDTOs = testPlan.getTestCases().stream()
                .map(testCaseService::mapToDTO)
                .collect(Collectors.toList());

        testPlanDTO.setTestCases(testCaseDTOs);
        return testPlanDTO;
    }*/

    private TestPlanDTO testPlanToDTO(TestPlan testPlan) {
        return testPlanMapper.toDTO(testPlan);
    }
}

