package com.example.backend.service;

import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // Метод отправки письма с токеном
    public void sendVerificationEmail(String recipientEmail, String token) {
        String subject = "Подтверждение email";
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token; // Это URL для подтверждения email

        String message = "Для подтверждения вашего аккаунта перейдите по ссылке: " + verificationUrl;

        // Настраиваем SimpleMailMessage
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        // Отправка письма
        mailSender.send(mailMessage);
        System.out.println(message);
        System.out.println(recipientEmail);
    }
}
