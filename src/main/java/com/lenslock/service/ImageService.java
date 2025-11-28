package com.lenslock.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Directory;
import com.drew.metadata.Metadata;
import com.drew.metadata.Tag;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.drew.metadata.exif.GpsDirectory;
import com.lenslock.model.AnalysisReport;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImageService {

    // Method 1: Reads the file and extracts hidden data
    public AnalysisReport analyzeImage(MultipartFile file) {
        AnalysisReport report = new AnalysisReport();
        report.setFileName(file.getOriginalFilename());

        try {
            Metadata metadata = ImageMetadataReader.readMetadata(file.getInputStream());
            Map<String, String> tagMap = new HashMap<>();

            for (Directory directory : metadata.getDirectories()) {
                for (Tag tag : directory.getTags()) {
                    tagMap.put(tag.getTagName(), tag.getDescription());
                }
            }
            report.setAllTags(tagMap);

            // Extract GPS
            GpsDirectory gpsDir = metadata.getFirstDirectoryOfType(GpsDirectory.class);
            if (gpsDir != null && gpsDir.getGeoLocation() != null) {
                report.setLatitude(gpsDir.getGeoLocation().getLatitude());
                report.setLongitude(gpsDir.getGeoLocation().getLongitude());
                report.setHasGpsData(true);
            } else {
                report.setHasGpsData(false);
            }

            // Extract Device Info
            ExifIFD0Directory deviceDir = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            if (deviceDir != null) {
                report.setDeviceModel(deviceDir.getString(ExifIFD0Directory.TAG_MODEL));
                report.setSoftware(deviceDir.getString(ExifIFD0Directory.TAG_SOFTWARE));
                report.setDateTimeTaken(deviceDir.getString(ExifIFD0Directory.TAG_DATETIME));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return report;
    }

    // Method 2: Creates a clean copy of the image without metadata
    public byte[] removeMetadata(MultipartFile file) throws IOException {
        // 1. Read the image pixels into memory (This ignores metadata by default)
        BufferedImage originalImage = ImageIO.read(file.getInputStream());

        // 2. Create a memory stream to write the new file
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // 3. Write the pixels back to the stream as a fresh JPG/PNG
        String format = "jpg";
        if (file.getOriginalFilename() != null && file.getOriginalFilename().toLowerCase().endsWith(".png")) {
            format = "png";
        }

        // ImageIO writes ONLY pixel data, effectively deleting EXIF tags
        ImageIO.write(originalImage, format, outputStream);

        // 4. Return the raw bytes of the clean image
        return outputStream.toByteArray();
    }
}