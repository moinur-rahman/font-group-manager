import React, { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import api from "../api";

interface FontUploadProps {
  onFontUploaded?: () => void;
}

const FontUpload: React.FC<FontUploadProps> = ({ onFontUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFont, setUploadedFont] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const validateTTF = (file: File): boolean => {
    return file && file.name.toLowerCase().endsWith(".ttf");
  };

  const uploadToServer = async (formData: FormData) => {
    try {
      setIsUploading(true);
      const response = await api.post("/upload-font.php", formData);
      const result = response.data;

      if (result.success) {
        setUploadedFont(result.data.name);
        setError("");

        if (onFontUploaded) {
          onFontUploaded();
        }
      } else {
        setUploadedFont(null);
        setError(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Error uploading font:", err);
      setError("Failed to upload font. Please try again.");
      setUploadedFont(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFile = (file: File) => {
    if (validateTTF(file)) {
      setUploadedFont(file.name);
      setError("");

      const formData = new FormData();
      formData.append("font", file);

      uploadToServer(formData);
    } else {
      setUploadedFont(null);
      setError("Only .ttf files are allowed.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Font Uploader
      </h3>

      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 flex flex-col items-center ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FiUploadCloud
          className={`text-6xl mb-4 ${
            isDragging ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <p
          className={`text-lg font-medium ${
            isDragging ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {isDragging
            ? "Release to upload file"
            : "Click to upload or drag and drop"}
        </p>
        <p className="text-sm text-gray-400 mt-2">Only TTF File Allowed</p>
      </div>

      <input
        type="file"
        accept=".ttf"
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      {isUploading && (
        <div className="mt-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-600 font-medium">Uploading font...</p>
        </div>
      )}

      {uploadedFont && !isUploading && (
        <div className="mt-5 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-600 font-medium">Uploaded: {uploadedFont}</p>
        </div>
      )}

      {error && (
        <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FontUpload;
