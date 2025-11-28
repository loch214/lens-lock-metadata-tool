package com.lenslock.model;

import lombok.Data;

import java.util.Map;

@Data
public class AnalysisReport {
    private String fileName;
    private String deviceModel;
    private String software;
    private Double latitude;
    private Double longitude;
    private String dateTimeTaken;
    private boolean hasGpsData;
    private Map<String, String> allTags;
}