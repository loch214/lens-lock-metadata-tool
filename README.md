# 🔒 Lens-Lock

This is a project I built to checks if an image contains hidden data (like GPS location or Device model) and allows you to "clean" that data to make the image safe for sharing.

## ⚠️ Important Note on Images
**This tool works best with "Raw" original photos** (e.g., photos taken directly from your camera or transferred via cable/email).

If you try to use an image downloaded from **Facebook, Instagram, or WhatsApp**, it probably won't show any results.
*   **Reason:** Social media platforms automatically run "scrubbers" that delete this metadata to save storage space and protect user privacy.
*   **To Test:** Take a photo with your phone (make sure Location is ON) and transfer it to your PC via USB or email to keep the data intact.

## 🛠️ How It Works (Technically)
1.  **Frontend (React):** You drag and drop an image file.
2.  **Backend (Java Spring Boot):** 
    *   The server receives the file as a binary stream.
    *   It uses a library called `metadata-extractor` to look for specific "EXIF tags" inside the file headers.
    *   If GPS coordinates are found, it sends them back to the frontend to display on a map.
3.  **Sanitization:** If you click "Download Safe Copy," the Java code creates a new copy of the image pixels *without* copying the metadata headers, effectively removing the location data.

## 🧪 Development Process
I built this project in two stages:
1.  **API First:** I started by building just the Java Backend and testing the endpoints using **Postman**. I made sure I could send a `POST` request with an image and get a JSON response with the coordinates.
2.  **UI Integration:** Once the logic was working, I built the React interface to visualize the data and show the map.

## 💻 Tech Stack
*   **Backend:** Java, Spring Boot
*   **Frontend:** React.js, Tailwind CSS
*   **Map:** Leaflet.js (OpenStreetMap)
*   **Database:** None (Processing is done in-memory)
