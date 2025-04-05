import React, { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import api from "../api";
import ConfirmDialog from "./ConfirmDialog";

interface FontRow {
  id?: string;
  name: string;
  fontFile: string;
}

interface FontGroup {
  id: string;
  title: string;
  fonts: FontRow[];
  createdAt: string;
  updatedAt?: string;
}

interface FontGroupListProps {
  refreshTrigger?: number;
}

const FontGroupList: React.FC<FontGroupListProps> = ({
  refreshTrigger = 0,
}) => {
  const [fontGroups, setFontGroups] = useState<FontGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] =
    useState<boolean>(false);
  const [groupToDelete, setGroupToDelete] = useState<FontGroup | null>(null);

  useEffect(() => {
    fetchFontGroups();
  }, [refreshTrigger]);

  const fetchFontGroups = async () => {
    try {
      setLoading(true);
      const response = await api.get("/get-font-groups.php");

      if (response.data.success) {
        setFontGroups(response.data.data);
        setError("");
      } else {
        setError("Failed to load font groups");
      }
    } catch (err) {
      console.error("Error fetching font groups:", err);
      setError("Failed to fetch font groups. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createFontFaces = () => {
    const uniqueFonts = new Set<string>();

    fontGroups.forEach((group) => {
      group.fonts.forEach((font) => {
        uniqueFonts.add(font.fontFile);
      });
    });

    return Array.from(uniqueFonts)
      .map(
        (fontName) => `
        @font-face {
          font-family: '${fontName.replace(/\.[^/.]+$/, "")}';
          src: url('${
            import.meta.env.VITE_API_BASE_URL
          }/serve-font.php?filename=${fontName}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
      `
      )
      .join("\n");
  };

  const handleDeleteClick = (group: FontGroup) => {
    setGroupToDelete(group);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;

    try {
      const response = await api.post(
        "/delete-font-group.php",
        { id: groupToDelete.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setFontGroups((prevGroups) =>
          prevGroups.filter((g) => g.id !== groupToDelete.id)
        );
      } else {
        setError(`Failed to delete: ${response.data.message}`);
      }
    } catch (err) {
      console.error("Error deleting font group:", err);
      setError("Failed to delete font group. Please try again.");
    } finally {
      setIsConfirmDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmDialogOpen(false);
    setGroupToDelete(null);
  };

  return (
    <div>
      <style>{createFontFaces()}</style>

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Font Groups</h3>
      <p className="mb-6 text-gray-600">List of all available font groups</p>

      {loading && <p className="text-gray-500">Loading font groups...</p>}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center mb-4">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}

      {fontGroups.length === 0 && !loading && (
        <p className="text-gray-500 italic">No font groups created yet.</p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {fontGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold text-gray-800">{group.title}</h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteClick(group)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete group"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="text-sm font-medium text-gray-500 mb-2">
                FONTS IN THIS GROUP
              </h5>
              <div className="space-y-3">
                {group.fonts.map((font, fontIndex) => {
                  const fontFamily = font.fontFile.replace(/\.[^/.]+$/, "");

                  return (
                    <div
                      key={fontIndex}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">{font.name}</span>
                      <span
                        className="text-lg"
                        style={{ fontFamily: fontFamily }}
                      >
                        Sample Text
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-right">
              Created: {new Date(group.createdAt).toLocaleDateString()}
              {group.updatedAt &&
                ` • Updated: ${new Date(group.updatedAt).toLocaleDateString()}`}
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        message={
          groupToDelete
            ? `Are you sure you want to delete "${groupToDelete.title}"?`
            : ""
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default FontGroupList;
