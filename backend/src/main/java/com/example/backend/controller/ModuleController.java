package com.example.backend.controller;

import com.example.backend.dto.ModuleDTO;
import com.example.backend.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:3000")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @PostMapping
    public ResponseEntity<ModuleDTO> createModule(@RequestBody ModuleDTO moduleDTO) {
        ModuleDTO createdModule = moduleService.createModule(moduleDTO);
        return ResponseEntity.ok(createdModule);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ModuleDTO>> getModulesByProjectId(@PathVariable Long projectId) {
        List<ModuleDTO> modules = moduleService.getModulesByProjectId(projectId);
        return ResponseEntity.ok(modules);
    }


}
