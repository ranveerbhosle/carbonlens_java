package com.carbonlens.controller;

import com.carbonlens.dto.BillUploadResponse;
import com.carbonlens.model.Bill;
import com.carbonlens.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;

    @PostMapping("/upload")
    public ResponseEntity<BillUploadResponse> uploadBill(
        @RequestParam("file") MultipartFile file,
        @RequestParam("billType") String billType) throws Exception {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(billService.uploadBill(file, billType));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Bill>> getBillHistory() {
        return ResponseEntity.ok(billService.getBillHistory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable String id) {
        return ResponseEntity.ok(billService.getBillById(id));
    }
}
