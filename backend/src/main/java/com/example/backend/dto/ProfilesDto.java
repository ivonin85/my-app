package com.example.backend.dto;

import lombok.Data;

@Data
public class ProfilesDto {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String middleName;
    private String dateOfBirth;
    private String photoUrl;
}
