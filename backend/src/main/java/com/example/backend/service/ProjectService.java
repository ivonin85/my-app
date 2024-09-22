package com.example.backend.service;

import com.example.backend.dto.ProjectDTO;
import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.service.mapper.ProjectMapper;
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

    public Project updateProject(Long id, Project updatedProject) {
        Project project = projectRepository.findById(id).orElseThrow();
        project.setTitle(updatedProject.getTitle());
        project.setDescription(updatedProject.getDescription());
        return projectRepository.save(project);
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
