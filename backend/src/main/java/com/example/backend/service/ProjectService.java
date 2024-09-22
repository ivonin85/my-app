package com.example.backend.service;

import com.example.backend.dto.ProjectDTO;
import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.service.mapper.ProjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectDTO> getProjectsByUser(Long userId) {
        return projectRepository.findByUserId(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Project createProject(Project project) {

        return projectRepository.save(project);
    }

    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Проект не найден"));

        project.setTitle(projectDTO.getTitle());
        project.setDescription(projectDTO.getDescription());

        Project savedProject = projectRepository.save(project);
        return mapToDTO(savedProject);
    }

    public void deleteProject(Long id) {

        projectRepository.deleteById(id);
    }

    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    private ProjectDTO mapToDTO(Project project) {
        return ProjectMapper.INSTANCE.projectToProjectDTO(project);
    }

}
