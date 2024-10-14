package com.example.backend.service.mapper;

import com.example.backend.model.dto.ProfileDTO;
import com.example.backend.model.entity.Profile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProfileMapper {

    ProfileMapper INSTANCE = Mappers.getMapper(ProfileMapper.class);

    @Mapping(source = "user.id", target = "userId")
    ProfileDTO profileToProfileDto(Profile profile);
}
