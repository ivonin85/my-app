package com.example.backend.service;

import com.example.backend.dto.TestCaseDTO;
import com.example.backend.dto.TestStepDTO;
import com.example.backend.model.Module;
import com.example.backend.model.*;
import com.example.backend.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestCaseService {

    @Autowired
    private TestCaseRepository testCaseRepository;

    public TestCaseDTO createTestCase(TestCaseDTO testCaseDTO) {
        TestCase testCase = mapToEntity(testCaseDTO);
        testCase = testCaseRepository.save(testCase);
        return mapToDTO(testCase);
    }

    public List<TestCaseDTO> getTestCasesByModule(Long moduleId) {
        List<TestCase> testCases = testCaseRepository.findByModuleId(moduleId);
        return testCases.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TestCaseDTO updateTestCase(Long id, TestCaseDTO testCaseDTO) {
        TestCase testCase = testCaseRepository.findById(id).orElseThrow();
        // Update fields here
        testCase = testCaseRepository.save(testCase);
        return mapToDTO(testCase);
    }

    public void deleteTestCase(Long id) {
        testCaseRepository.deleteById(id);
    }

    private TestCase mapToEntity(TestCaseDTO dto) {
        TestCase testCase = new TestCase();
        testCase.setId(dto.getId());
        testCase.setTitle(dto.getTitle());
        testCase.setDescription(dto.getDescription());
        testCase.setPreconditions(dto.getPreconditions());

        // Преобразование шагов тест-кейса (TestStepDTO -> TestStep)
        List<TestStep> steps = dto.getSteps().stream()
                .map(stepDTO -> {
                    TestStep step = new TestStep();
                    step.setAction(stepDTO.getAction());
                    step.setExpectedResult(stepDTO.getExpectedResult());
                    return step;
                }).collect(Collectors.toList());
        testCase.setSteps(steps);

        testCase.setPriority(dto.getPriority());
        testCase.setSeverity(dto.getSeverity());
        testCase.setStatus(dto.getStatus());
        testCase.setRequirements(dto.getRequirements());
        testCase.setComments(dto.getComments());

        // Преобразование тегов (List<String> -> List<Tag>)
        List<Tag> tags = dto.getTags().stream()
                .map(tagName -> {
                    Tag tag = new Tag();
                    tag.setName(tagName);
                    return tag;
                }).collect(Collectors.toList());
        testCase.setTags(tags);

        // Преобразование внешних ключей
        if (dto.getExecutorId() != null) {
            User executor = new User();
            executor.setId(dto.getExecutorId());
            testCase.setExecutor(executor);
        }

        if (dto.getModuleId() != null) {
            Module module = new Module();
            module.setId(dto.getModuleId());
            testCase.setModule(module);
        }

        testCase.setCreatedAt(dto.getCreatedAt());
        testCase.setUpdatedAt(dto.getUpdatedAt());

        return testCase;
    }


    private TestCaseDTO mapToDTO(TestCase entity) {
        TestCaseDTO dto = new TestCaseDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPreconditions(entity.getPreconditions());

        // Преобразование шагов тест-кейса (TestStep -> TestStepDTO)
        List<TestStepDTO> stepDTOs = entity.getSteps().stream()
                .map(step -> {
                    TestStepDTO stepDTO = new TestStepDTO();
                    stepDTO.setAction(step.getAction());
                    stepDTO.setExpectedResult(step.getExpectedResult());
                    return stepDTO;
                }).collect(Collectors.toList());
        dto.setSteps(stepDTOs);

        dto.setPriority(entity.getPriority());
        dto.setSeverity(entity.getSeverity());
        dto.setStatus(entity.getStatus());
        dto.setRequirements(entity.getRequirements());
        dto.setComments(entity.getComments());

        // Преобразование тегов (List<Tag> -> List<String>)
        List<String> tags = entity.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toList());
        dto.setTags(tags);

        // Преобразование внешних ключей
        if (entity.getExecutor() != null) {
            dto.setExecutorId(entity.getExecutor().getId());
        }

        if (entity.getModule() != null) {
            dto.setModuleId(entity.getModule().getId());
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

}