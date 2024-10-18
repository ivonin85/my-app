package com.example.backend.repository;

import com.example.backend.model.entity.TestPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestPlanRepository extends JpaRepository<TestPlan, Long> {
}
