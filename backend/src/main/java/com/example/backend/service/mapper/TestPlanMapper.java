package com.example.backend.service.mapper;

import com.example.backend.model.dto.TestCaseDTO;
import com.example.backend.model.dto.TestPlanDTO;
import com.example.backend.model.entity.TestCase;
import com.example.backend.model.entity.TestPlan;
import com.example.backend.service.TestCaseService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TestPlanMapper {

    @Mapping(target = "testCases", source = "testCases", qualifiedByName = "mapTestCasesToDTOs")
    TestPlanDTO toDTO(TestPlan testPlan);

    @Named("mapTestCasesToDTOs")
    default List<TestCaseDTO> mapTestCasesToDTOs(List<TestCase> testCases) {
        return testCases.stream()
                .map(new TestCaseService()::mapToDTO)
                .collect(Collectors.toList());
    }

    List<TestPlanDTO> toDTOList(List<TestPlan> testPlans);
}
