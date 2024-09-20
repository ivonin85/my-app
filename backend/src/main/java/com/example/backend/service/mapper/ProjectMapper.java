package com.example.backend.service.mapper;

import com.example.backend.dto.ProjectDTO;
import com.example.backend.model.Project;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ProjectMapper {
    ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

    @Mapping(source = "user.id", target = "userId")
    ProjectDTO projectToProjectDTO(Project project);
}
