package com.example.backend.service;

import com.example.backend.dto.ProjectDTO;
import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectDTO> getProjectsByUser(Long userId) {
        List<Project> projects = projectRepository.findByUserId(userId);
        return projects.stream()
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

    private ProjectDTO mapToDTO(Project project) {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setId(project.getId());
        projectDTO.setUserId(project.getUser().getId());
        projectDTO.setTitle(project.getTitle());
        projectDTO.setDescription(project.getDescription());
        return projectDTO;
    }

}
