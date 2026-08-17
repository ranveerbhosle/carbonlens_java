package com.carbonlens.service;

import com.carbonlens.dto.BillUploadResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class CarbonCalculatorService {

    public BillUploadResponse calculate(String ocrText, String billType) {
        String type = billType.toUpperCase();

        return switch (type) {
            case "ELECTRICITY" -> calculateElectricity(ocrText);
            case "PETROL" -> calculatePetrol(ocrText);
            case "DIESEL" -> calculateDiesel(ocrText);
            case "LPG" -> calculateLpg(ocrText);
            default -> throw new IllegalArgumentException("Unsupported bill type: " + billType);
        };
    }

    private BillUploadResponse calculateElectricity(String text) {
        double kwh = extractNumber(text,
            "(?i)(total\\s*units?|units?\\s*consumed?|kwh|kw\\s*h)[^\\d]*(\\d+\\.?\\d*)",
            "(?i)(\\d+\\.?\\d*)\\s*(kwh|kw\\s*h|units?)");

        if (kwh <= 0) kwh = extractFirstLargeNumber(text, 10, 5000);

        double co2 = Math.round(kwh * 0.82 * 100.0) / 100.0;
        String level = kwh * 0.82 < 100 ? "Low" : kwh * 0.82 < 300 ? "Medium" : "High";
        String tip = switch (level) {
            case "High" -> "Your electricity usage is very high. Consider switching to LED bulbs, unplugging unused devices, and using appliances during off-peak hours.";
            case "Medium" -> "Moderate usage detected. Try setting your AC to 24°C and using natural light during daytime.";
            default -> "Great job! Your electricity consumption is low. Keep it up!";
        };

        BillUploadResponse res = new BillUploadResponse();
        res.setConsumptionValue(kwh);
        res.setConsumptionUnit("kWh");
        res.setCo2Emitted(co2);
        res.setEmissionLevel(level);
        res.setTip(tip);
        res.setBillType("Electricity");
        res.setBillDate(LocalDate.now());
        return res;
    }

    private BillUploadResponse calculatePetrol(String text) {
        double liters = extractNumber(text,
            "(?i)(qty|quantity|liters?|litres?)[^\\d]*(\\d+\\.?\\d*)",
            "(?i)(\\d+\\.?\\d*)\\s*(l|ltr|liters?|litres?)");

        if (liters <= 0) liters = extractFirstLargeNumber(text, 1, 500);

        double co2 = Math.round(liters * 2.31 * 100.0) / 100.0;
        String level = co2 < 20 ? "Low" : co2 < 60 ? "Medium" : "High";
        String tip = level.equals("High")
            ? "High fuel consumption detected. Consider carpooling, using public transport, or switching to an EV."
            : level.equals("Medium") ? "Moderate petrol usage. Try route optimization and regular vehicle servicing."
            : "Good job keeping your fuel consumption low!";

        BillUploadResponse res = new BillUploadResponse();
        res.setConsumptionValue(liters);
        res.setConsumptionUnit("L");
        res.setCo2Emitted(co2);
        res.setEmissionLevel(level);
        res.setTip(tip);
        res.setBillType("Petrol");
        res.setBillDate(LocalDate.now());
        return res;
    }

    private BillUploadResponse calculateDiesel(String text) {
        double liters = extractNumber(text,
            "(?i)(qty|quantity|liters?|litres?)[^\\d]*(\\d+\\.?\\d*)",
            "(?i)(\\d+\\.?\\d*)\\s*(l|ltr|liters?|litres?)");

        if (liters <= 0) liters = extractFirstLargeNumber(text, 1, 500);

        double co2 = Math.round(liters * 2.68 * 100.0) / 100.0;
        String level = co2 < 20 ? "Low" : co2 < 60 ? "Medium" : "High";
        String tip = level.equals("High")
            ? "High diesel consumption detected. Consider route optimization and switching to fuel-efficient vehicles."
            : level.equals("Medium") ? "Moderate diesel usage. Smooth driving habits can cut consumption by 30%."
            : "Excellent! Your diesel usage is low. Keep it up!";

        BillUploadResponse res = new BillUploadResponse();
        res.setConsumptionValue(liters);
        res.setConsumptionUnit("L");
        res.setCo2Emitted(co2);
        res.setEmissionLevel(level);
        res.setTip(tip);
        res.setBillType("Diesel");
        res.setBillDate(LocalDate.now());
        return res;
    }

    private BillUploadResponse calculateLpg(String text) {
        double kg = extractNumber(text,
            "(?i)(lpg|cylinder|gas)[^\\d]*(\\d+\\.?\\d*)\\s*kg",
            "(?i)(\\d+\\.?\\d*)\\s*kg");

        if (kg <= 0) kg = extractFirstLargeNumber(text, 1, 100);

        double co2 = Math.round(kg * 2.98 * 100.0) / 100.0;
        String level = co2 < 30 ? "Low" : co2 < 90 ? "Medium" : "High";
        String tip = level.equals("High")
            ? "High LPG usage. Use pressure cookers to reduce cooking time and gas consumption."
            : level.equals("Medium") ? "Moderate LPG usage. Opt for solar cooking when possible to reduce consumption."
            : "Great! Your LPG consumption is within a healthy range.";

        BillUploadResponse res = new BillUploadResponse();
        res.setConsumptionValue(kg);
        res.setConsumptionUnit("kg");
        res.setCo2Emitted(co2);
        res.setEmissionLevel(level);
        res.setTip(tip);
        res.setBillType("LPG");
        res.setBillDate(LocalDate.now());
        return res;
    }

    private double extractNumber(String text, String... patterns) {
        for (String pattern : patterns) {
            Pattern p = Pattern.compile(pattern);
            Matcher m = p.matcher(text);
            if (m.find()) {
                try {
                    String numStr = m.group(m.groupCount());
                    return Double.parseDouble(numStr);
                } catch (NumberFormatException | IllegalStateException ignored) {}
            }
        }
        return 0;
    }

    private double extractFirstLargeNumber(String text, double min, double max) {
        Pattern p = Pattern.compile("\\d+\\.?\\d*");
        Matcher m = p.matcher(text);
        while (m.find()) {
            try {
                double val = Double.parseDouble(m.group());
                if (val >= min && val <= max) return val;
            } catch (NumberFormatException ignored) {}
        }
        return 0;
    }
}
