package com.carbonlens.service;

import com.carbonlens.dto.DashboardResponse;
import com.carbonlens.model.Bill;
import com.carbonlens.model.User;
import com.carbonlens.repository.BillRepository;
import com.carbonlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BillRepository billRepository;
    private final UserRepository userRepository;

    public DashboardResponse.Summary getSummary() {
        User user = getCurrentUser();
        LocalDate start = LocalDate.now().withDayOfMonth(1);
        LocalDate end = LocalDate.now().plusMonths(1).withDayOfMonth(1);
        List<Bill> billsThisMonth = billRepository.findByUserIdAndBillDateBetween(user.getId(), start, end);
        Double totalCo2 = billsThisMonth.stream().mapToDouble(Bill::getCo2Emitted).sum();
        totalCo2 = Math.round(totalCo2 * 100.0) / 100.0;

        Long totalBills = billRepository.countByUserId(user.getId());

        String status;
        if (totalCo2 < 100) status = "Low";
        else if (totalCo2 < 300) status = "Medium";
        else status = "High";

        // Find best month
        List<org.bson.Document> trend = billRepository.getMonthlyTrend(user.getId());
        String bestMonth = "N/A";
        if (!trend.isEmpty()) {
            org.bson.Document best = trend.stream()
                .min(Comparator.comparingDouble(r -> ((Number) r.get("total")).doubleValue()))
                .orElse(null);
            if (best != null) {
                org.bson.Document idDoc = (org.bson.Document) best.get("_id");
                int month = idDoc.getInteger("month");
                bestMonth = Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            }
        }

        return new DashboardResponse.Summary(totalCo2, totalBills, status, bestMonth);
    }

    public DashboardResponse.Trend getTrend() {
        User user = getCurrentUser();
        List<org.bson.Document> raw = billRepository.getMonthlyTrend(user.getId());

        // Document has "_id": { "month": x, "year": y }, "total": z
        List<org.bson.Document> sorted = raw.stream()
            .sorted(Comparator.comparingInt((org.bson.Document r) -> ((org.bson.Document) r.get("_id")).getInteger("year"))
                .thenComparingInt(r -> ((org.bson.Document) r.get("_id")).getInteger("month")))
            .collect(Collectors.toList());

        int size = Math.min(sorted.size(), 6);
        List<org.bson.Document> last6 = sorted.subList(Math.max(0, sorted.size() - size), sorted.size());

        List<String> labels = new ArrayList<>();
        List<Double> values = new ArrayList<>();
        for (org.bson.Document row : last6) {
            org.bson.Document idDoc = (org.bson.Document) row.get("_id");
            int month = idDoc.getInteger("month");
            labels.add(Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
            values.add(Math.round(((Number) row.get("total")).doubleValue() * 100.0) / 100.0);
        }

        return new DashboardResponse.Trend(labels, values);
    }

    public DashboardResponse.Breakdown getBreakdown() {
        User user = getCurrentUser();
        List<org.bson.Document> raw = billRepository.getBreakdownByType(user.getId());

        List<String> labels = new ArrayList<>();
        List<Double> values = new ArrayList<>();
        for (org.bson.Document row : raw) {
            labels.add(row.getString("_id"));
            values.add(Math.round(((Number) row.get("total")).doubleValue() * 100.0) / 100.0);
        }

        return new DashboardResponse.Breakdown(labels, values);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
