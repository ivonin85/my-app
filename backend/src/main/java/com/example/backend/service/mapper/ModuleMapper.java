package com.example.backend.service.mapper;

import com.example.backend.model.dto.ModuleDTO;
import com.example.backend.model.entity.Module;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper

public interface ModuleMapper {
    ModuleMapper INSTANCE = Mappers.getMapper(ModuleMapper.class);

    @Mapping(source = "parent.id", target = "parentId")
    ModuleDTO moduleToModuleDTO(Module module);

}
