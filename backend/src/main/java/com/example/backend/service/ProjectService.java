package com.example.backend.service;

import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.model.dto.ProjectDTO;
import com.example.backend.model.entity.Project;
import com.example.backend.model.entity.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.mapper.ProjectMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProjectMapper projectMapper;

    public List<ProjectDTO> getProjectsByUser(Long userId) {
        return projectRepository.findByOwnerOrMembers(userId)
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

    public void addMemberToProject(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Проект не найден"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Пользователь не найден"));

        project.getMembers().add(user);
        projectRepository.save(project);
    }

    public ProjectDTO getProjectByIdAndUser(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!project.getOwner().getId().equals(userId) &&
                project.getMembers().stream().noneMatch(user -> user.getId().equals(userId))) {
            throw new AccessDeniedException("You do not have access to this project");
        }

        return projectMapper.projectToProjectDTO(project);
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
