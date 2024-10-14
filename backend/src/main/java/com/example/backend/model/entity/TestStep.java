package com.example.backend.model.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class TestStep {
    private String action;
    private String expectedResult;
}