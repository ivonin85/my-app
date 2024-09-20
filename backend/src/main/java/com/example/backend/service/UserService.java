package com.example.backend.service;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.model.User;
import com.example.backend.model.VerificationToken;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VerificationTokenRepository;
import com.example.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService; // Сервис для отправки email

    // Регистрация пользователя и отправка email для подтверждения
    public ResponseEntity<?> register(UserDto usersDto) {
        if (userRepository.findByEmail(usersDto.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email уже существует", HttpStatus.BAD_REQUEST);
        }

        User user = new User();
        user.setEmail(usersDto.getEmail());
        user.setPassword(passwordEncoder.encode(usersDto.getPassword()));
        user.setEmailVerified(false); // Новый пользователь должен подтвердить email
        userRepository.save(user);

        // Генерация токена и отправка email
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken(user, token);
        tokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(user.getEmail(), token); // Отправка email

        return new ResponseEntity<>("Пользователь успешно зарегистрирован. Проверьте почту для подтверждения.", HttpStatus.OK);
    }

    // Подтверждение email по токену
    public ResponseEntity<?> verifyEmail(String token) {
        Optional<VerificationToken> verificationTokenOpt = tokenRepository.findByToken(token);
        if (!verificationTokenOpt.isPresent()) {
            return new ResponseEntity<>("Неверный токен", HttpStatus.BAD_REQUEST);
        }

        VerificationToken verificationToken = verificationTokenOpt.get();
        User user = verificationToken.getUser();
        if (user.isEmailVerified()) {
            return new ResponseEntity<>("Email уже подтвержден", HttpStatus.BAD_REQUEST);
        }

        user.setEmailVerified(true);
        userRepository.save(user);

        return new ResponseEntity<>("Email успешно подтвержден", HttpStatus.OK);
    }

    // Метод для авторизации пользователя
    public ResponseEntity<?> login(AuthRequest authRequest) {
        Optional<User> userOpt = userRepository.findByEmail(authRequest.getEmail());

        // Проверка наличия пользователя и соответствия пароля
        if (userOpt.isPresent() && passwordEncoder.matches(authRequest.getPassword(), userOpt.get().getPassword())) {
            User user = userOpt.get();

            // Проверка, подтвержден ли email
            if (!user.isEmailVerified()) {
                return new ResponseEntity<>("Email не подтвержден. Проверьте почту для завершения регистрации.", HttpStatus.UNAUTHORIZED);
            }

            // Генерация JWT токена
            String token = jwtTokenProvider.createToken(user.getId().toString());

            // Создание cookie с JWT токеном
            ResponseCookie jwtCookie = ResponseCookie.from("auth_token", token)
                    .httpOnly(true)
                    .secure(true) // установите в true для HTTPS
                    .path("/")
                    .maxAge(24 * 60 * 60) // срок действия cookie - 24 часа
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body("Авторизация успешна");
        }

        return new ResponseEntity<>("Неверные учетные данные", HttpStatus.UNAUTHORIZED);
    }
}
