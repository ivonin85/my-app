package com.example.backend.service.mapper;

import com.example.backend.model.dto.ProjectDTO;
import com.example.backend.model.entity.Project;
import com.example.backend.model.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ProjectMapper {
    ProjectMapper INSTANCE = Mappers.getMapper(ProjectMapper.class);

    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "members", target = "memberIds")
    ProjectDTO projectToProjectDTO(Project project);

    @Mapping(source = "ownerId", target = "owner.id")
    @Mapping(source = "memberIds", target = "members")
    Project projectDTOToProject(ProjectDTO projectDTO);

    default Set<Long> mapMembersToIds(Set<User> members) {
        return members.stream().map(User::getId).collect(Collectors.toSet());
    }

    default Set<User> mapIdsToMembers(Set<Long> memberIds) {
        return memberIds.stream().map(id -> {
            User user = new User();
            user.setId(id);
            return user;
        }).collect(Collectors.toSet());
    }
}

