package com.vit.resultportal.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "subjects")
@Data
public class Subject {
    @Id
    private String subjectCode;
    private String subjectName;
    private String branchScope;
    private Integer credits;
}