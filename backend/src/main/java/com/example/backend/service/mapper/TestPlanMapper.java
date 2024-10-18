package com.example.backend.service.mapper;

import com.example.backend.model.dto.TagDTO;
import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.model.entity.Tag;
import com.example.backend.model.entity.TestPlan;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TestPlanMapper {
    TestPlanMapper INSTANCE = Mappers.getMapper(TestPlanMapper.class);
    TestPlanDTO toDTO(TestPlan testPlan);
    TestPlan toEntity(TestPlanDTO testPlanDTO);

    default List<String> mapTagsToStrings(List<Tag> tags) {
        return tags.stream().map(Tag::getName).collect(Collectors.toList());
    }

    default List<Tag> mapStringsToTags(List<String> tagNames) {
        return tagNames.stream().map(name -> {
            Tag tag = new Tag();
            tag.setName(name);
            return tag;
        }).collect(Collectors.toList());
    }
}

