package com.carbonlens.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {

    @Id
    private String id;

    private String userId;

    private String billType;

    private Double consumptionValue;

    private String consumptionUnit;

    private Double co2Emitted;

    private String emissionLevel;

    private LocalDate billDate;

    private LocalDateTime uploadedAt = LocalDateTime.now();
}
