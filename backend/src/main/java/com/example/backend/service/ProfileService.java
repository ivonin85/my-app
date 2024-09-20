package com.example.backend.service;

import com.example.backend.dto.ProfileDto;
import com.example.backend.model.Profile;
import com.example.backend.model.User;
import com.example.backend.repository.ProfileRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileService {

    @Autowired
    private ProfileRepository profilesRepository;

    @Autowired
    private UserRepository userRepository;

    // Метод получения профиля по ID пользователя
    public ResponseEntity<ProfileDto> getUserProfile(Long userId) {
        // Получение профиля пользователя по userId
        Optional<Profile> profileOpt = profilesRepository.findByUserId(userId);

        // Если профиль существует, возвращаем его
        if (profileOpt.isPresent()) {
            Profile profile = profileOpt.get();
            ProfileDto profilesDto = mapToDto(profile);
            return ResponseEntity.ok(profilesDto);
        } else {
            // Иначе создаем новый профиль, если его нет
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                Profile newProfile = new Profile();
                newProfile.setUser(userOpt.get());
                profilesRepository.save(newProfile); // Сохраняем новый профиль в базе

                return ResponseEntity.ok(mapToDto(newProfile));
            } else {
                // Возвращаем ошибку, если пользователя также не найдено
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        }
    }

    // Метод обновления профиля пользователя
    public ResponseEntity<ProfileDto> updateUserProfile(Long userId, ProfileDto profilesDto) {
        Optional<Profile> profileOpt = profilesRepository.findByUserId(userId);

        if (profileOpt.isPresent()) {
            Profile profile = profileOpt.get();
            profile.setName(profilesDto.getName());
            profile.setSurname(profilesDto.getSurname());
            profile.setPatronymic(profilesDto.getPatronymic());
            profile.setDateOfBirth(profilesDto.getDateOfBirth());
            profile.setPhotoUrl(profilesDto.getPhotoUrl());

            profilesRepository.save(profile);
            return ResponseEntity.ok(mapToDto(profile));
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Метод для преобразования модели в DTO
    private ProfileDto mapToDto(Profile profile) {
        ProfileDto dto = new ProfileDto();
        dto.setId(profile.getId());
        dto.setUserId(profile.getUser().getId());
        dto.setName(profile.getName());
        dto.setSurname(profile.getSurname());
        dto.setPatronymic(profile.getPatronymic());
        dto.setDateOfBirth(profile.getDateOfBirth());
        dto.setPhotoUrl(profile.getPhotoUrl());
        return dto;
    }
}
