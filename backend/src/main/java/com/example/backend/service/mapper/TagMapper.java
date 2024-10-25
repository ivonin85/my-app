package com.example.backend.service.mapper;

import com.example.backend.model.dto.TagDTO;
import com.example.backend.model.entity.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagMapper INSTANCE = Mappers.getMapper(TagMapper.class);

    @Mapping(source = "project.id", target = "projectId")
    TagDTO toTagDTO(Tag tag);

    @Mapping(source = "projectId", target = "project.id")
    Tag toTag(TagDTO tagDTO);

    List<TagDTO> toTagDTOs(List<Tag> tags);

    List<Tag> toTags(List<TagDTO> tagDTOs);
}
