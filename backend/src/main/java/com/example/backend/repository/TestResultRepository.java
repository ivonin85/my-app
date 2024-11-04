package com.example.backend.repository;

import com.example.backend.model.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByTestRunId(Long testRunId);
}
