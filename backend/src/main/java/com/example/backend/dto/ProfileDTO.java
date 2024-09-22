package com.example.backend.dto;

import lombok.Data;

@Data
public class ProfileDTO {
    private Long id;
    private Long userId;
    private String name;
    private String surname;
    private String patronymic;
    private String dateOfBirth;
    private String photoUrl;
}
