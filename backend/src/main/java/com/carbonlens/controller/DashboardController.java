package com.carbonlens.controller;

import com.carbonlens.dto.DashboardResponse;
import com.carbonlens.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardResponse.Summary> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/trend")
    public ResponseEntity<DashboardResponse.Trend> getTrend() {
        return ResponseEntity.ok(dashboardService.getTrend());
    }

    @GetMapping("/breakdown")
    public ResponseEntity<DashboardResponse.Breakdown> getBreakdown() {
        return ResponseEntity.ok(dashboardService.getBreakdown());
    }
}
