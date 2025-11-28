# 🔒 Lens-Lock

Lens-Lock is a digital privacy tool designed to analyze and secure image metadata. It checks if an image contains hidden data (like GPS coordinates or Device models) and allows users to "clean" that data to make the image safe for sharing.

## ⚠️ Important Note on Images
**This tool works best with "Raw" original photos** (e.g., photos taken directly from your camera or transferred via cable/email).

If you try to use an image downloaded from **Facebook, Instagram, or WhatsApp**, it likely won't show any hidden data.
*   **Reason:** Social media platforms automatically run "scrubbers" that delete this metadata to save storage space and protect user privacy.
*   **To Test:** Take a photo with your phone (make sure Location is ON) and transfer it to your PC via USB or email to keep the data intact.

## 🛠️ How It Works (Technically)
1.  **Binary Analysis (Java Backend):**
    *   The Spring Boot server receives the file stream and uses the `metadata-extractor` library to parse specific "EXIF tags."
    *   It extracts raw GPS coordinates, Device Model, Software version, and Capture Time.
2.  **Visualization (React Frontend):** 
    *   **City Detection:** Uses the **BigDataCloud API** (Reverse Geocoding) to convert raw coordinates into a City/Country name (e.g., "Colombo, Sri Lanka").
    *   **Satellite Mapping:** Uses **Leaflet.js** with **Esri World Imagery** tiles to show a high-resolution satellite view of the location.
    *   **Verification:** Includes a direct link to open the coordinates in **Google Maps** for external verification.
3.  **Sanitization:** 
    *   When "Download Safe Copy" is clicked, the backend reconstructs the image pixel-by-pixel using Java's `ImageIO`, intentionally dropping the metadata headers while preserving image quality.

## 🧪 Development Process
I built this project in two stages to simulate a real software engineering workflow:
1.  **API First:** I started by building the Java Backend and testing the endpoints using **Postman**. I verified I could send a `POST` request with a raw image and receive a structured JSON response.
2.  **UI Integration:** Once the backend logic was robust, I built the React interface to visualize the data, handling file uploads and map rendering.

## 💻 Tech Stack & APIs
*   **Backend:** Java 17, Spring Boot (REST API)
*   **Frontend:** React.js, Tailwind CSS (Vite)
*   **Mapping Engine:** Leaflet.js
*   **Map Tiles:** Esri World Imagery (Satellite View)
*   **External APIs:** 
    *   **BigDataCloud** (Free Reverse Geocoding for City Names)
    *   **Google Maps** (External Link integration)
*   **Data Handling:** In-memory binary processing (No database required)

## 🔮 Future Improvements
Maybe be i will add more features later like when downloading the safe copy, select the options that need to keep/remove and add support for bulk processing (multiple images at once).
