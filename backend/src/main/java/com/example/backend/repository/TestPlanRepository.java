package com.example.backend.repository;

import com.example.backend.model.entity.TestPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestPlanRepository extends JpaRepository<TestPlan, Long> {
    List<TestPlan> findByProjectId(Long projectId);
}
