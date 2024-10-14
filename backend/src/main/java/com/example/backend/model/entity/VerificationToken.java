package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "verification_token")
public class VerificationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    private Boolean emailVerified;

    public VerificationToken() {
    }

    public VerificationToken(User user, String token) {
        this.user = user;
        this.token = token;
    }
}
