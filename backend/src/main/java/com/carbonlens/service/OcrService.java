package com.carbonlens.service;

import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

@Service
public class OcrService {

    @Value("${tesseract.datapath}")
    private String tesseractDataPath;

    public String extractText(MultipartFile file) throws IOException, TesseractException {
        String contentType = file.getContentType();
        if (contentType == null) throw new IllegalArgumentException("Unknown file type");

        if (contentType.equals("application/pdf")) {
            return extractTextFromPdf(file);
        } else if (contentType.startsWith("image/")) {
            return extractTextFromImage(file);
        } else {
            throw new IllegalArgumentException("Unsupported file type: " + contentType);
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(doc);
        }
    }

    private String extractTextFromImage(MultipartFile file) throws IOException, TesseractException {
        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath(tesseractDataPath);
        tesseract.setLanguage("eng");

        BufferedImage img;
        try (InputStream is = file.getInputStream()) {
            img = ImageIO.read(is);
        }
        if (img == null) throw new IOException("Cannot read image file");
        return tesseract.doOCR(img);
    }
}
