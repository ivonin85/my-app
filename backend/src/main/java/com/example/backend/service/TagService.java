package com.example.backend.service;

import com.example.backend.dto.TagDTO;
import com.example.backend.service.mapper.TagMapper;
import com.example.backend.model.Tag;
import com.example.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagMapper tagMapper;

    public List<TagDTO> getAllTags() {
        return tagMapper.toTagDTOs(tagRepository.findAll());
    }

    public TagDTO createTag(TagDTO tagDTO) {
        Tag tag = tagMapper.toTag(tagDTO);
        Tag savedTag = tagRepository.save(tag);
        return tagMapper.toTagDTO(savedTag);
    }

    public List<TagDTO> getTagsByTestCaseId(Long testCaseId) {
        return tagMapper.toTagDTOs(tagRepository.findByTestCaseId(testCaseId));
    }
}
