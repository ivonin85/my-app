package com.example.backend.dto;

import lombok.Data;

@Data
public class UsersDto {
    private Long id;
    private String email;
    private String password;
}
