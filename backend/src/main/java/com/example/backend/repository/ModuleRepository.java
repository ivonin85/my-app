package com.example.backend.repository;

import com.example.backend.model.Module;
import com.example.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByProjectId(Long projectId);
    List<Module> findByProject(Project project);
}
