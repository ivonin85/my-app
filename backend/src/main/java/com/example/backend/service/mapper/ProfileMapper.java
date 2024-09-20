package com.example.backend.service.mapper;

import com.example.backend.dto.ProfileDto;
import com.example.backend.model.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProfileMapper {

    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

    @Mapping(source = "user.id", target = "userId")
    ProfileDto profileToProfileDto(Profile profile);
}
