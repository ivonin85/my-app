package com.example.backend.service.mapper;

import com.example.backend.model.dto.TestResultDTO;
import com.example.backend.model.entity.TestResult;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface TestResultMapper {

    TestResultMapper INSTANCE = Mappers.getMapper(TestResultMapper.class);

    @Mapping(source = "testRun.id", target = "testRunId")
    @Mapping(source = "testCase.id", target = "testCaseId")
    TestResultDTO testResultToDTO(TestResult testResult);

    @Mapping(source = "testRunId", target = "testRun.id")
    @Mapping(source = "testCaseId", target = "testCase.id")
    TestResult testResultToEntity(TestResultDTO testResultDTO);
}
