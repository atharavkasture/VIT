package com.vit.resultportal.repository;

import com.vit.resultportal.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Integer> {
    // Spring Data JPA automatically creates the method implementation
    List<Result> findByStudent_PrnNo(String prnNo);
}