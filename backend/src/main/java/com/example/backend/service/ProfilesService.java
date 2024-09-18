package com.example.backend.service;

import com.example.backend.dto.ProfilesDto;
import com.example.backend.model.Profiles;
import com.example.backend.model.Users;
import com.example.backend.repository.ProfilesRepository;
import com.example.backend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfilesService {

    @Autowired
    private ProfilesRepository profilesRepository;

    @Autowired
    private UsersRepository usersRepository;

    // Метод получения профиля по ID пользователя
    public ResponseEntity<ProfilesDto> getUserProfile(Long userId) {
        // Получение профиля пользователя по userId
        Optional<Profiles> profileOpt = profilesRepository.findByUserId(userId);

        // Если профиль существует, возвращаем его
        if (profileOpt.isPresent()) {
            Profiles profile = profileOpt.get();
            ProfilesDto profilesDto = mapToDto(profile);
            return ResponseEntity.ok(profilesDto);
        } else {
            // Иначе создаем новый профиль, если его нет
            Optional<Users> userOpt = usersRepository.findById(userId);
            if (userOpt.isPresent()) {
                Profiles newProfile = new Profiles();
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
    public ResponseEntity<ProfilesDto> updateUserProfile(Long userId, ProfilesDto profilesDto) {
        Optional<Profiles> profileOpt = profilesRepository.findByUserId(userId);

        if (profileOpt.isPresent()) {
            Profiles profile = profileOpt.get();
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
    private ProfilesDto mapToDto(Profiles profile) {
        ProfilesDto dto = new ProfilesDto();
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
