package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "modules")
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Module parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Module> children;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
