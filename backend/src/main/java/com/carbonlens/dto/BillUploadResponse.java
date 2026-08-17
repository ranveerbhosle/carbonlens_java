package com.carbonlens.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillUploadResponse {
    private String id;
    private String billType; 
    private Double consumptionValue;
    private String consumptionUnit;
    private Double co2Emitted;
    private String emissionLevel;
    private String tip;
    private LocalDate billDate;
}
