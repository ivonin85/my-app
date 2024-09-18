package com.example.backend.service;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.UsersDto;
import com.example.backend.model.Users;
import com.example.backend.repository.UsersRepository;
import com.example.backend.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.Cookie;

import java.util.Optional;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public ResponseEntity<?> register(UsersDto usersDto) {
        if (usersRepository.findByEmail(usersDto.getEmail()).isPresent()) {
            return new ResponseEntity<>("Email уже существует", HttpStatus.BAD_REQUEST);
        }

        Users users = new Users();
        users.setEmail(usersDto.getEmail());
        users.setPassword(passwordEncoder.encode(usersDto.getPassword()));

        usersRepository.save(users);

        return new ResponseEntity<>("Пользователь успешно зарегистрирован", HttpStatus.OK);
    }

    public ResponseEntity<?> login(AuthRequest authRequest) {
        Optional<Users> userOpt = usersRepository.findByEmail(authRequest.getEmail());
        if (userOpt.isPresent() && passwordEncoder.matches(authRequest.getPassword(), userOpt.get().getPassword())) {
            String token = jwtTokenProvider.createToken(userOpt.get().getId().toString());

            // Создание cookie с JWT токеном
            ResponseCookie jwtCookie = ResponseCookie.from("auth_token", token)
                    .httpOnly(true)
                    .secure(true) // установите в true для HTTPS
                    .path("/")
                    .maxAge(24 * 60 * 60) // срок действия cookie
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body("Авторизация успешна");
        }
        return new ResponseEntity<>("Неверные учетные данные", HttpStatus.UNAUTHORIZED);
    }

    // Получение пользователя по ID
    public ResponseEntity<UsersDto> getUserById(Long id) {
        Optional<Users> userOpt = usersRepository.findById(id);
        if (userOpt.isPresent()) {
            Users user = userOpt.get();
            UsersDto usersDto = new UsersDto();
            usersDto.setId(user.getId());
            usersDto.setEmail(user.getEmail());
            return ResponseEntity.ok(usersDto);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
