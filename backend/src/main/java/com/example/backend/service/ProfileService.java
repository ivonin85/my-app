package com.example.backend.service;

import com.example.backend.dto.ProfileDTO;
import com.example.backend.model.Profile;
import com.example.backend.model.User;
import com.example.backend.repository.ProfileRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.mapper.ProfileMapper;
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

    public ResponseEntity<ProfileDTO> getUserProfile(Long userId) {
        // Получение профиля пользователя по userId
        Optional<Profile> profileOpt = profilesRepository.findByUserId(userId);

        // Если профиль существует, возвращаем его
        if (profileOpt.isPresent()) {
            Profile profile = profileOpt.get();
            ProfileDTO profilesDto = mapToDto(profile);
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

    public ResponseEntity<ProfileDTO> updateUserProfile(Long userId, ProfileDTO profilesDto) {
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

    private ProfileDTO mapToDto(Profile profile) {
        return ProfileMapper.INSTANCE.profileToProfileDto(profile);
    }
}
