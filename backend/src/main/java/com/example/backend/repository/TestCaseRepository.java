package com.example.backend.repository;

import com.example.backend.model.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TestCaseRepository extends JpaRepository<TestCase, Long> {
    List<TestCase> findByModuleId(Long moduleId);
    @Query("SELECT tc FROM TestCase tc JOIN tc.tags t WHERE t.id = :tagId")
    List<TestCase> findByTagId(@Param("tagId") Long tagId);
}
