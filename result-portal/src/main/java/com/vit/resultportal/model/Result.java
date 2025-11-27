package com.vit.resultportal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Formula;
import java.math.BigDecimal;

@Entity
@Table(name = "results")
@Data
public class Result {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer resultId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "prn_no", referencedColumnName = "prnNo")
    @JsonIgnore
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_code", referencedColumnName = "subjectCode")
    private Subject subject;

    private BigDecimal mse;
    private BigDecimal ese;

    @Formula("mse + ese")
    private BigDecimal total;
}