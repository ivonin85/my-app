package com.example.backend.service.mapper;

import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.model.entity.TestCase;
import com.example.backend.model.entity.Tag;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TestCaseMapper {
    TestCaseDTO toDTO(TestCase testCase);
    TestCase toEntity(TestCaseDTO testCaseDTO);

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