package com.example.backend.service.mapper;

import com.example.backend.dto.TagDTO;
import com.example.backend.model.Tag;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagMapper INSTANCE = Mappers.getMapper(TagMapper.class);

    TagDTO toTagDTO(Tag tag);

    Tag toTag(TagDTO tagDTO);

    List<TagDTO> toTagDTOs(List<Tag> tags);

    List<Tag> toTags(List<TagDTO> tagDTOs);
}
