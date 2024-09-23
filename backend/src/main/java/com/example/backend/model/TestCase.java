package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "test_cases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String preconditions;

    @ElementCollection
    private List<TestStep> steps;

    private String priority;
    private String severity;
    private String status;
    private String requirements;
    private String comments;

    @ManyToMany
    @JoinTable(
            name = "testcase_tags",
            joinColumns = @JoinColumn(name = "testcase_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    @ManyToOne
    @JoinColumn(name = "executor_id")
    private User executor;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private Module module;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
