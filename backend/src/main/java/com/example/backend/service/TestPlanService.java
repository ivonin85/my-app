package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.model.entity.TestCase;
import com.example.backend.model.entity.TestPlan;
import com.example.backend.repository.TestPlanRepository;
import com.example.backend.service.mapper.TestCaseMapper;
import com.example.backend.service.mapper.TestPlanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class TestPlanService {

    @Autowired
    private TestPlanRepository testPlanRepository;

    @Autowired
    private TestCaseService testCaseService;

    @Autowired
    private TestPlanMapper testPlanMapper;

    @Autowired
    private TestCaseMapper testCaseMapper;

    public TestPlanDTO createTestPlan(String name, List<Long> moduleIds, List<Long> tagIds) {
        TestPlan testPlan = new TestPlan();
        testPlan.setName(name);
        testPlan.setModuleIds(moduleIds);
        testPlan.setTagIds(tagIds);

        // Используем Set для устранения дубликатов
        Set<TestCase> testCases = new HashSet<>();

        // Получаем тест-кейсы по модулям
        for (Long moduleId : moduleIds) {
            List<TestCaseDTO> moduleTestCaseDTOs = testCaseService.getTestCasesByModule(moduleId);
            List<TestCase> moduleTestCases = moduleTestCaseDTOs.stream()
                    .map(testCaseMapper::toEntity)
                    .toList();
            testCases.addAll(moduleTestCases);
        }

        // Получаем тест-кейсы по тегам
        for (Long tagId : tagIds) {
            List<TestCaseDTO> tagTestCaseDTOs = testCaseService.getTestCasesByTag(tagId);
            List<TestCase> tagTestCases = tagTestCaseDTOs.stream()
                    .map(testCaseMapper::toEntity)
                    .toList();
            testCases.addAll(tagTestCases);
        }

        // Устанавливаем тест-кейсы в тест-план
        testPlan.setTestCases(new ArrayList<>(testCases));
        TestPlan savedTestPlan = testPlanRepository.save(testPlan);

        return testPlanMapper.toDTO(savedTestPlan);
    }

    public TestPlanDTO getTestPlanById(Long id) {
        TestPlan testPlan = testPlanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Test Plan not found"));
        return testPlanMapper.toDTO(testPlan);
    }
}

