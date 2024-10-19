package com.example.backend.service;

import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.model.dto.TestStepDTO;
import com.example.backend.model.entity.Module;
import com.example.backend.model.entity.*;
import com.example.backend.repository.TagRepository;
import com.example.backend.repository.TestCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestCaseService {

    @Autowired
    private TestCaseRepository testCaseRepository;

    @Autowired
    private TagRepository tagRepository;

    public TestCaseDTO createTestCase(TestCaseDTO testCaseDTO) {
        TestCase testCase = mapToEntity(testCaseDTO);
        testCase = testCaseRepository.save(testCase);
        return mapToDTO(testCase);
    }

    public List<TestCaseDTO> getTestCasesByModule(Long moduleId) {
        List<TestCase> testCases = testCaseRepository.findByModuleId(moduleId);
        return testCases.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public TestCaseDTO getTestCaseById(Long testCaseId) {
        TestCase testCase = testCaseRepository.findById(testCaseId)
                .orElseThrow(() -> new RuntimeException("Тест-кейс не найден с ID: " + testCaseId));
        return mapToDTO(testCase);
    }

    public TestCaseDTO updateTestCase(Long id, TestCaseDTO testCaseDTO) {
        // Находим существующий тест-кейс или выбрасываем исключение, если не найден
        TestCase existingTestCase = testCaseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Test case not found with id: " + id));

        // Преобразуем DTO в новую сущность TestCase, при этом обновим только поля, которые изменяются
        TestCase updatedTestCase = mapToEntity(testCaseDTO);

        // Сохраняем неизменяемые поля, такие как id, createdAt
        updatedTestCase.setId(existingTestCase.getId());
        updatedTestCase.setCreatedAt(existingTestCase.getCreatedAt());

        // Сохраняем изменения в базу данных
        TestCase savedTestCase = testCaseRepository.save(updatedTestCase);

        // Преобразуем сохраненный тест-кейс обратно в DTO и возвращаем
        return mapToDTO(savedTestCase);
    }


    public void deleteTestCase(Long id) {
        testCaseRepository.deleteById(id);
    }

    public List<TestCaseDTO> getTestCasesByTag(Long tagId) {
        List<TestCase> testCases = testCaseRepository.findByTagId(tagId);
        return testCases.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TestCase mapToEntity(TestCaseDTO dto) {
        TestCase testCase = new TestCase();
        testCase.setId(dto.getId());
        testCase.setTitle(dto.getTitle());
        testCase.setDescription(dto.getDescription());
        testCase.setPreconditions(dto.getPreconditions());

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

        // Преобразование тегов (List<String> -> List<Tag>), проверка и сохранение новых тегов
        List<Tag> tags = dto.getTags().stream()
                .map(tagName -> tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            return tagRepository.save(newTag); // Сохраняем тег перед присвоением
                        }))
                .collect(Collectors.toList());
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

        if (dto.getProjectId() != null) {
            Project project = new Project();
            project.setId(dto.getProjectId());
            testCase.setProject(project);
        }

        testCase.setCreatedAt(dto.getCreatedAt());
        testCase.setUpdatedAt(dto.getUpdatedAt());

        return testCase;
    }


    public TestCaseDTO mapToDTO(TestCase entity) {
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

        if (entity.getProject() != null) {
            dto.setProjectId(entity.getProject().getId());
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

}
