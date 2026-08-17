package com.carbonlens.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class DashboardResponse {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Summary {
        private Double totalCo2;
        private Long totalBills;
        private String emissionStatus;
        private String bestMonth;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Trend {
        private List<String> labels;
        private List<Double> values;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Breakdown {
        private List<String> labels;
        private List<Double> values;
    }
}
