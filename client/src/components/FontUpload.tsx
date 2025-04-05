import React, { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

const FontUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFont, setUploadedFont] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  const validateTTF = (file: File): boolean => {
    return file && file.name.toLowerCase().endsWith(".ttf");
  };

  const handleFile = (file: File) => {
    if (validateTTF(file)) {
      setUploadedFont(file.name);
      setError("");

      const formData = new FormData();
      formData.append("font", file);

      console.log("Uploaded:", file.name);
    } else {
      setUploadedFont(null);
      setError("Only .ttf files are allowed.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
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
        className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300 flex flex-col items-center"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <FiUploadCloud className="text-gray-400 text-6xl mb-4" />
        <p className="text-lg font-medium text-gray-600">
          Click to upload or drag and drop
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

      {uploadedFont && (
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
