package com.example.backend.controller;

import com.example.backend.model.dto.ModuleDTO;
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

    @GetMapping("/{id}")
    public ResponseEntity<ModuleDTO> getModuleById(@PathVariable Long id) {
        ModuleDTO moduleDTO = moduleService.getModuleById(id);
        return ResponseEntity.ok(moduleDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ModuleDTO> updateModule(@PathVariable Long id, @RequestBody ModuleDTO moduleDTO) {
        ModuleDTO updatedModule = moduleService.updateModule(id, moduleDTO);
        return ResponseEntity.ok(updatedModule);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        moduleService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }

}
