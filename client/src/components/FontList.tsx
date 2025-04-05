import React, { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import api from "../api";
import ConfirmDialog from "./ConfirmDialog";

interface Font {
  name: string;
  path: string;
  filename?: string;
  uploadedAt: string;
}

interface FontListProps {
  onFontDeleted?: () => void;
  refreshTrigger?: number;
}

const FontList: React.FC<FontListProps> = ({
  onFontDeleted,
  refreshTrigger = 0,
}) => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [fontToDelete, setFontToDelete] = useState<Font | null>(null);

  const createFontFaces = () => {
    return fonts
      .map(
        (font) => `
        @font-face {
          font-family: '${font.name.replace(/\.[^/.]+$/, "")}';
          src: url('${
            import.meta.env.VITE_API_BASE_URL
          }/serve-font.php?filename=${font.name}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `
      )
      .join("\n");
  };

  const fetchFonts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get-fonts.php");

      if (response.data.success) {
        setFonts(response.data.data);
        setError("");
      } else {
        setError("Failed to load fonts");
      }
    } catch (err) {
      console.error("Error fetching fonts:", err);
      setError("Failed to fetch fonts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (font: Font) => {
    setFontToDelete(font);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!fontToDelete) return;

    try {
      const response = await api.post(
        "/delete-font.php",
        { filename: fontToDelete.name },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setFonts((prevFonts) =>
          prevFonts.filter((f) => f.name !== fontToDelete.name)
        );

        if (onFontDeleted) {
          onFontDeleted();
        }
      } else {
        setError(`Failed to delete: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Error deleting font:", err);
      setError("Failed to delete font. Please try again.");
    } finally {
      setIsConfirmDialogOpen(false);
      setFontToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setFontToDelete(null);
  };

  useEffect(() => {
    fetchFonts();
  }, [refreshTrigger]);

  return (
    <div className="mt-8">
      <style>{createFontFaces()}</style>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Fonts</h3>

      {loading && <p className="text-gray-500">Loading fonts...</p>}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center mb-4">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}

      {fonts.length === 0 && !loading && (
        <p className="text-gray-500 italic">No fonts uploaded yet.</p>
      )}

      {fonts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-4 font-semibold text-gray-700">
                  FONT NAME
                </th>
                <th className="text-left p-4 font-semibold text-gray-700">
                  PREVIEW
                </th>
                <th className="w-20"></th>
              </tr>
            </thead>
            <tbody>
              {fonts.map((font, index) => {
                const fontName = font.name.replace(/\.[^/.]+$/, "");

                return (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <h4 className="font-medium text-gray-800">{font.name}</h4>
                    </td>
                    <td className="p-4">
                      <div className="text-xl" style={{ fontFamily: fontName }}>
                        Example Style
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(font)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete font"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        message={
          fontToDelete
            ? `Are you sure you want to delete ${fontToDelete.name}?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default FontList;
