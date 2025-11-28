import { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import MapDisplay from './MapDisplay';

function App() {
    const [report, setReport] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setCurrentFile(file); // Save file info (contains size)
        setLoading(true);
        setError(null);
        setReport(null);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await axios.post("http://localhost:8080/api/images/analyze", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReport(response.data);
        } catch (err) {
            console.error(err);
            setError("❌ Backend Connection Failed. Is IntelliJ Server running?");
        } finally {
            setLoading(false);
        }
    };

    const handleSanitize = async () => {
        if (!currentFile) return;

        const formData = new FormData();
        formData.append("image", currentFile);

        try {
            const response = await axios.post("http://localhost:8080/api/images/sanitize", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `safe_${currentFile.name}`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (err) {
            console.error(err);
            alert("Failed to download safe image.");
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // Helper: Convert "2025:11:28 15:25:01" -> Date & Time
    const formatDateTime = (rawString) => {
        if (!rawString) return { date: "Unknown", time: "--:--" };
        const parts = rawString.split(" ");
        const date = parts[0] ? parts[0].replace(/:/g, "-") : "Unknown";
        const time = parts[1] || "--:--";
        return { date, time };
    };

    // Helper: Convert raw bytes to MB/KB
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const timeData = report ? formatDateTime(report.dateTimeTaken) : null;

    return (
        <div className="min-h-screen bg-black text-green-500 p-10 font-mono">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 border-b border-green-800 pb-4 flex items-center gap-3">
                    LENS-LOCK v1.0 🔒
                </h1>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed p-12 text-center cursor-pointer transition-all rounded-lg
          ${isDragActive ? 'border-green-400 bg-green-900/20' : 'border-gray-800 hover:border-green-600 hover:bg-gray-900'}`}
                >
                    <input {...getInputProps()} />
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="animate-pulse tracking-widest">DECRYPTING BINARY DATA...</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 hover:text-green-400 transition-colors">DROP TARGET IMAGE HERE</p>
                    )}
                </div>

                {error && <div className="mt-4 text-red-400 bg-red-900/20 border border-red-500 p-3 rounded">{error}</div>}

                {report && (
                    <div className="mt-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-4 border-l-4 border-green-500 pl-3">
                            <h2 className="text-xl font-bold text-white">FORENSIC REPORT</h2>

                            <button
                                onClick={handleSanitize}
                                className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded flex items-center gap-2 transition-colors text-sm"
                            >
                                🛡️ DOWNLOAD SAFE COPY
                            </button>
                        </div>

                        <div className="bg-gray-900 p-6 rounded border border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Row 1 */}
                            <div className="border-b border-gray-800 pb-2">
                                <p className="text-xs text-gray-500 mb-1">FILE NAME</p>
                                <p className="text-white break-all">{report.fileName}</p>
                            </div>

                            {/* NEW: File Size Box */}
                            <div className="border-b border-gray-800 pb-2">
                                <p className="text-xs text-gray-500 mb-1">FILE SIZE</p>
                                <p className="text-white">{currentFile ? formatFileSize(currentFile.size) : "Unknown"}</p>
                            </div>

                            {/* Row 2 */}
                            <div className="border-b border-gray-800 pb-2">
                                <p className="text-xs text-gray-500 mb-1">DEVICE MODEL</p>
                                <p className="text-yellow-300 font-bold">{report.deviceModel || "Unknown Device"}</p>
                            </div>
                            <div className="border-b border-gray-800 pb-2">
                                <p className="text-xs text-gray-500 mb-1">LOCATION TAG</p>
                                {report.hasGpsData ? (
                                    <span className="text-red-500 font-bold bg-red-900/30 px-2 py-0.5 rounded animate-pulse">ON</span>
                                ) : (
                                    <span className="text-green-500 font-bold bg-green-900/30 px-2 py-0.5 rounded">OFF</span>
                                )}
                            </div>

                            {/* Row 3 */}
                            <div className="border-b border-gray-800 pb-2 md:border-b-0">
                                <p className="text-xs text-gray-500 mb-1">DATE CAPTURED</p>
                                <p className="text-white">{timeData.date}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">TIME CAPTURED</p>
                                <p className="text-white">{timeData.time}</p>
                            </div>

                        </div>

                        {report.hasGpsData && (
                            <div className="mt-6 border border-red-900/50 rounded overflow-hidden">
                                <div className="bg-red-900/20 p-2 text-center text-red-400 text-xs tracking-widest">
                                    ⚠️ GEOLOCATION DATA EXPOSED
                                </div>
                                <MapDisplay lat={report.latitude} lng={report.longitude} />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;