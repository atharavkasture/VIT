package com.vit.resultportal.service;

import com.vit.resultportal.exception.ResourceNotFoundException;
import com.vit.resultportal.model.Result;
import com.vit.resultportal.repository.ResultRepository;
import com.vit.resultportal.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {
    @Autowired
    private ResultRepository resultRepository;
    @Autowired
    private StudentRepository studentRepository;

    public List<Result> getStudentResults(String prn) {
        if (!studentRepository.existsById(prn)) {
            throw new ResourceNotFoundException("Student not found with PRN: " + prn);
        }
        return resultRepository.findByStudent_PrnNo(prn);
    }
}