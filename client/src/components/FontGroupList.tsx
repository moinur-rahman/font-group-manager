import React, { useState, useEffect } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import api from "../api";
import ConfirmDialog from "./ConfirmDialog";
import { FontGroup } from "../types";

interface FontGroupListProps {
  refreshTrigger?: number;
  onEditGroup?: (group: FontGroup) => void;
}

const FontGroupList: React.FC<FontGroupListProps> = ({
  refreshTrigger = 0,
  onEditGroup,
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

  const handleEditClick = (group: FontGroup) => {
    if (onEditGroup) {
      onEditGroup(group);
    }
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

      <h3 className="text-2xl font-bold text-gray-800 mb-2">Font Groups</h3>
      <p className="mb-6 text-gray-600">Manage your font groups</p>

      {loading && <p className="text-gray-500">Loading font groups...</p>}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center mb-4">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      )}

      {fontGroups.length === 0 && !loading && (
        <p className="text-gray-500 italic">No font groups created yet.</p>
      )}

      {fontGroups.length > 0 && !loading && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fonts
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Count
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fontGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {group.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">
                    {group.fonts.map((font) => font.name).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {group.fonts.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(group)}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit group"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(group)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete group"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
