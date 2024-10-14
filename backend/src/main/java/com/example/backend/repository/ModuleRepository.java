package com.example.backend.repository;

import com.example.backend.model.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {
    List<Module> findByProjectId(Long projectId);
}
