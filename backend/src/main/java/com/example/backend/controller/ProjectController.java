package com.example.backend.controller;

import com.example.backend.dto.ProjectDTO;
import com.example.backend.model.Project;
import com.example.backend.model.User;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ProjectService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @GetMapping
    public List<ProjectDTO> getProjectsByUser() {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return projectService.getProjectsByUser(Long.parseLong(userId));
    }


    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO project) {
        String userId = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Project projectData = new Project();

        Optional<User> user = userRepository.findById(Long.parseLong(userId));

        user.ifPresent(foundUser -> {
            projectData.setUser(foundUser);
            projectData.setTitle(project.getTitle());
            projectData.setDescription(project.getDescription());
        });


        Project createdProject = projectService.createProject(projectData);

        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setId(createdProject.getId());
        projectDTO.setUserId(createdProject.getUser().getId());
        projectDTO.setTitle(createdProject.getTitle());
        projectDTO.setDescription(createdProject.getDescription());


        return ResponseEntity.status(HttpStatus.CREATED).body(projectDTO);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        ProjectDTO projectDTO = projectService.getProjectById(id);
        return projectDTO != null ? ResponseEntity.ok().body(projectDTO) : ResponseEntity.notFound().build();
    }
}
