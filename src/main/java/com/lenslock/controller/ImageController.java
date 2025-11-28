package com.lenslock.controller;

import com.lenslock.model.AnalysisReport;
import com.lenslock.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "http://localhost:5173") // Allow React Frontend to access this
public class ImageController {

    @Autowired
    private ImageService imageService;

    // Endpoint 1: Analyze the image and return metadata report
    @PostMapping("/analyze")
    public ResponseEntity<AnalysisReport> analyze(@RequestParam("image") MultipartFile file) {
        System.out.println("📸 Received request to analyze: " + file.getOriginalFilename());
        return ResponseEntity.ok(imageService.analyzeImage(file));
    }

    // Endpoint 2: Remove metadata and return the clean image file
    @PostMapping("/sanitize")
    public ResponseEntity<byte[]> sanitizeImage(@RequestParam("image") MultipartFile file) {
        try {
            System.out.println("🧹 Sanitizing image: " + file.getOriginalFilename());

            // Call the service to strip metadata
            byte[] cleanImageBytes = imageService.removeMetadata(file);

            // Return the file with headers that force the browser to download it
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"safe_" + file.getOriginalFilename() + "\"")
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(cleanImageBytes);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}