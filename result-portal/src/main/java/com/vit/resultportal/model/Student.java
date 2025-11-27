package com.vit.resultportal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "students")
@Data
public class Student {
    @Id
    private String prnNo;
    private String name;
    private String branch;
    private String division;
    private Integer year;
    private Integer semester;
}