package com.example.backend.service;


import com.example.backend.dto.ModuleDTO;
import com.example.backend.model.Module;
import com.example.backend.model.Project;
import com.example.backend.repository.ModuleRepository;
import com.example.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ProjectRepository projectRepository;

    // Инициализация через конструктор с использованием @Autowired
    @Autowired
    public ModuleService(ModuleRepository moduleRepository, ProjectRepository projectRepository) {
        this.moduleRepository = moduleRepository;
        this.projectRepository = projectRepository;
    }

    public List<ModuleDTO> getModulesByProjectId(Long projectId) {
        List<Module> modules = moduleRepository.findByProjectId(projectId);
        return modules.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ModuleDTO createModule(ModuleDTO moduleDTO) {
        // Получаем проект по projectId
        Project project = projectRepository.findById(moduleDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Создаем новый модуль
        Module module = new Module();
        module.setName(moduleDTO.getName());
        module.setProject(project);

        // Если указан родительский модуль, находим его и устанавливаем
        if (moduleDTO.getParentId() != null) {
            Module parentModule = moduleRepository.findById(moduleDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent module not found"));
            module.setParent(parentModule);
        }

        // Сохраняем модуль
        Module savedModule = moduleRepository.save(module);

        // Возвращаем DTO после сохранения
        return convertToDTO(savedModule);
    }

    // Метод для конвертации Module в ModuleDTO
    private ModuleDTO convertToDTO(Module module) {
        ModuleDTO dto = new ModuleDTO();
        dto.setId(module.getId());
        dto.setName(module.getName());

        if (module.getParent() != null) {
            dto.setParentId(module.getParent().getId());
        }

        dto.setProjectId(module.getProject().getId());

        return dto;
    }
}
