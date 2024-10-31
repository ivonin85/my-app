package com.example.backend.service;


import com.example.backend.model.dto.ModuleDTO;
import com.example.backend.model.entity.Module;
import com.example.backend.model.entity.Project;
import com.example.backend.repository.ModuleRepository;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.service.mapper.ModuleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final ProjectRepository projectRepository;

    @Autowired
    public ModuleService(ModuleRepository moduleRepository, ProjectRepository projectRepository) {
        this.moduleRepository = moduleRepository;
        this.projectRepository = projectRepository;
    }

    public List<ModuleDTO> getModulesByProjectId(Long projectId) {
        List<Module> modules = moduleRepository.findByProjectId(projectId);
        return modules.stream().map(this::moduleToModuleDTO).collect(Collectors.toList());
    }

    public ModuleDTO getModuleById(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found with id " + moduleId));
        return moduleToModuleDTO(module);
    }

    public void deleteModule(Long moduleId) {
        moduleRepository.deleteById(moduleId);
    }

    public ModuleDTO createModule(ModuleDTO moduleDTO) {
        // Получаем проект по projectId
        Project project = projectRepository.findById(moduleDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Проект не найден"));

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
        return moduleToModuleDTO(savedModule);
    }

    public ModuleDTO updateModule(Long moduleId, ModuleDTO moduleDTO) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        module.setName(moduleDTO.getName());
        if (moduleDTO.getParentId() != null) {
            Module parentModule = moduleRepository.findById(moduleDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent module not found"));
            module.setParent(parentModule);
        } else {
            module.setParent(null);
        }

        Module updatedModule = moduleRepository.save(module);
        return moduleToModuleDTO(updatedModule);
    }

    // Метод для конвертации Module в ModuleDTO
    private ModuleDTO moduleToModuleDTO(Module module) {
        return ModuleMapper.INSTANCE.moduleToModuleDTO(module);
    }
}
