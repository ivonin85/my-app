package com.example.backend.repository;

import com.example.backend.model.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByModuleId(Long moduleId);
}
