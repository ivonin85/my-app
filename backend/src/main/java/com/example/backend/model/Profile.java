package com.example.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Связь с моделью Users
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    private String name;
    private String surname;
    private String patronymic;
    private String dateOfBirth; // Используйте LocalDate, если хотите сохранять даты
    private String photoUrl; // Для хранения ссылки на фото
}
