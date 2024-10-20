package com.example.backend.repository;

import com.example.backend.model.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    @Query("SELECT t FROM Tag t JOIN t.testCases tc WHERE tc.id = :testCaseId")
    List<Tag> findByTestCaseId(@Param("testCaseId") Long testCaseId);

}

