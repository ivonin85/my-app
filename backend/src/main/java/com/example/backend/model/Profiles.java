package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "profiles")
public class Profiles {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Связь с моделью Users
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private Users user;

    private String firstName;
    private String lastName;
    private String middleName;
    private String dateOfBirth; // Используйте LocalDate, если хотите сохранять даты
    private String photoUrl; // Для хранения ссылки на фото
}
