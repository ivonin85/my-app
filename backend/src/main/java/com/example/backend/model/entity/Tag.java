package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = true) // временно позволяем null
    private Project project;

    @ManyToMany(mappedBy = "tags")
    private List<TestCase> testCases;

}
