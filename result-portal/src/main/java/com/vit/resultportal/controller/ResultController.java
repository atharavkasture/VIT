package com.vit.resultportal.controller;

import com.vit.resultportal.model.Result;
import com.vit.resultportal.model.Student;
import com.vit.resultportal.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class ResultController {

    @Autowired
    private ResultService resultService;

    // Inside ResultController.java

    @GetMapping("/results/{prn}")
    public ResponseEntity<?> getResultsForStudent(@PathVariable String prn) {
        List<Result> results = resultService.getStudentResults(prn);

        // This is an edge case: if a student exists but has no results,
        // the list will be empty, and the next line will crash.
        if (results.isEmpty()) {
            // You can return an empty list or a message.
            // For this assignment, we know students have results, but this makes the code safer.
            return ResponseEntity.ok(Map.of("student", null, "results", List.of()));
        }

        Student student = results.get(0).getStudent();

        List<Map<String, Object>> mappedResults = results.stream().map(result -> {
            // --- The change starts here ---
            // Instead of Map.of(), we create a HashMap explicitly.
            Map<String, Object> map = new HashMap<>();
            map.put("subject_code", result.getSubject().getSubjectCode());
            map.put("subject_name", result.getSubject().getSubjectName());
            map.put("credits", result.getSubject().getCredits());
            map.put("mse", result.getMse());
            map.put("ese", result.getEse());
            map.put("total", result.getTotal());
            return map;
            // --- The change ends here ---
        }).collect(Collectors.toList());

        Map<String, Object> response = Map.of(
                "student", student,
                "results", mappedResults
        );

        return ResponseEntity.ok(response);
    }
}