package com.example.backend.controller;

import com.example.backend.model.dto.TagDTO;
import com.example.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<TagDTO>> getAllTags() {
        List<TagDTO> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @PostMapping
    public ResponseEntity<TagDTO> createTag(@RequestBody TagDTO tagDTO) {
        TagDTO createdTag = tagService.createTag(tagDTO);
        return ResponseEntity.ok(createdTag);
    }

    @GetMapping("/testcase/{testCaseId}")
    public ResponseEntity<List<TagDTO>> getTagsByTestCaseId(@PathVariable Long testCaseId) {
        List<TagDTO> tags = tagService.getTagsByTestCaseId(testCaseId);
        return ResponseEntity.ok(tags);
    }
}
