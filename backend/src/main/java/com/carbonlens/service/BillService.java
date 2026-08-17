package com.carbonlens.service;

import com.carbonlens.dto.BillUploadResponse;
import com.carbonlens.model.Bill;
import com.carbonlens.model.User;
import com.carbonlens.repository.BillRepository;
import com.carbonlens.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;
    private final UserRepository userRepository;
    private final OcrService ocrService;
    private final CarbonCalculatorService calculatorService;

    public BillUploadResponse uploadBill(MultipartFile file, String billType) throws Exception {
        User user = getCurrentUser();
        String ocrText = ocrService.extractText(file);
        BillUploadResponse result = calculatorService.calculate(ocrText, billType);

        Bill bill = new Bill();
        bill.setUserId(user.getId());
        bill.setBillType(result.getBillType());
        bill.setConsumptionValue(result.getConsumptionValue());
        bill.setConsumptionUnit(result.getConsumptionUnit());
        bill.setCo2Emitted(result.getCo2Emitted());
        bill.setEmissionLevel(result.getEmissionLevel());
        bill.setBillDate(result.getBillDate());
        Bill saved = billRepository.save(bill);
        result.setId(saved.getId());

        return result;
    }

    public List<Bill> getBillHistory() {
        return billRepository.findByUserIdOrderByUploadedAtDesc(getCurrentUser().getId());
    }

    public Bill getBillById(String id) {
        User user = getCurrentUser();
        return billRepository.findByIdAndUserId(id, user.getId())
            .orElseThrow(() -> new RuntimeException("Bill not found or access denied"));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
