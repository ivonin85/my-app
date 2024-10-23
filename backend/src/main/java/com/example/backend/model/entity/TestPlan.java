package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "test_plans")
public class TestPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ElementCollection
    @CollectionTable(name = "test_plan_module_ids", joinColumns = @JoinColumn(name = "test_plan_id"))
    @Column(name = "module_id")
    private List<Long> moduleIds; // Список ID модулей, из которых были добавлены тест-кейсы

    @ElementCollection
    @CollectionTable(name = "test_plan_tag_ids", joinColumns = @JoinColumn(name = "test_plan_id"))
    @Column(name = "tag_id")
    private List<Long> tagIds; // Список ID тегов, из которых были добавлены тест-кейсы

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "test_plan_cases",
            joinColumns = @JoinColumn(name = "test_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "test_case_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"test_plan_id", "test_case_id"})
    )
    private List<TestCase> testCases;

    private Long projectId;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
