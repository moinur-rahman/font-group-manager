import React, { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import api from "../api";
import { Font, FontGroup, FontRow } from "../types";

interface FontGroupFormProps {
  onGroupCreated: () => void;
  editingGroup?: FontGroup | null;
  onEditComplete?: () => void;
}

const FontGroupForm: React.FC<FontGroupFormProps> = ({
  onGroupCreated,
  editingGroup = null,
  onEditComplete,
}) => {
  const [availableFonts, setAvailableFonts] = useState<Font[]>([]);
  const [groupTitle, setGroupTitle] = useState<string>("");
  const [fontRows, setFontRows] = useState<FontRow[]>([
    { id: crypto.randomUUID(), name: "", fontFile: "" },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchFonts();
  }, []);

  useEffect(() => {
    if (editingGroup) {
      setGroupTitle(editingGroup.title);

      const fontsCopy = editingGroup.fonts.map((font) => ({
        id: font.id || crypto.randomUUID(),
        name: font.name,
        fontFile: font.fontFile,
      }));

      setFontRows(fontsCopy);
      setIsEditMode(true);
    } else {
      resetForm();
      setIsEditMode(false);
    }
  }, [editingGroup]);

  const fetchFonts = async () => {
    try {
      const response = await api.get("/get-fonts.php");
      if (response.data.success) {
        setAvailableFonts(response.data.data);
      } else {
        setError("Failed to load fonts");
      }
    } catch (err) {
      console.error("Error fetching fonts:", err);
      setError("Failed to fetch fonts. Please try again.");
    }
  };

  const resetForm = () => {
    setGroupTitle("");
    setFontRows([{ id: crypto.randomUUID(), name: "", fontFile: "" }]);
    setError("");
    setSuccess("");
  };

  const handleAddRow = () => {
    setFontRows([
      ...fontRows,
      { id: crypto.randomUUID(), name: "", fontFile: "" },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    if (fontRows.length <= 1) return;
    setFontRows(fontRows.filter((row) => row.id !== id));
  };

  const handleFontNameChange = (id: string, value: string) => {
    setFontRows(
      fontRows.map((row) => (row.id === id ? { ...row, name: value } : row))
    );
  };

  const handleFontFileChange = (id: string, value: string) => {
    setFontRows(
      fontRows.map((row) => (row.id === id ? { ...row, fontFile: value } : row))
    );
  };

  const validateForm = (): boolean => {
    if (!groupTitle.trim()) {
      setError("Group title is required");
      return false;
    }

    if (fontRows.length < 2) {
      setError("At least two fonts are required");
      return false;
    }

    for (const row of fontRows) {
      if (!row.name.trim()) {
        setError("All font names are required");
        return false;
      }
      if (!row.fontFile) {
        setError("All fonts must be selected");
        return false;
      }
    }

    const selectedFonts = fontRows.map((row) => row.fontFile);
    if (new Set(selectedFonts).size !== selectedFonts.length) {
      setError("Duplicate fonts are not allowed");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      if (isEditMode && editingGroup) {
        const response = await api.post(
          "/update-font-group.php",
          {
            id: editingGroup.id,
            title: groupTitle,
            fonts: fontRows,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setSuccess("Font group updated successfully!");
          if (onEditComplete) {
            onEditComplete();
          }
          resetForm();
        } else {
          setError(response.data.message || "Failed to update font group");
        }
      } else {
        const response = await api.post(
          "/create-font-group.php",
          {
            title: groupTitle,
            fonts: fontRows,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setSuccess("Font group created successfully!");
          resetForm();

          if (onGroupCreated) {
            onGroupCreated();
          }
        } else {
          setError(response.data.message || "Failed to create font group");
        }
      }
    } catch (err) {
      console.error("Error with font group operation:", err);
      setError(
        `Failed to ${
          isEditMode ? "update" : "create"
        } font group. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    resetForm();
    setIsEditMode(false);
    if (onEditComplete) {
      onEditComplete();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        {isEditMode ? "Edit Font Group" : "Create Font Group"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="groupTitle"
            className="block text-gray-700 font-medium mb-2"
          >
            Group Title
          </label>
          <input
            type="text"
            id="groupTitle"
            value={groupTitle}
            onChange={(e) => setGroupTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter group title"
          />
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-700 mb-4">
            Font Selection
          </h4>

          <div className="space-y-3">
            {fontRows.map((row) => (
              <div key={row.id} className="flex items-center space-x-3">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={row.name}
                    onChange={(e) =>
                      handleFontNameChange(row.id, e.target.value)
                    }
                    placeholder="Font name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex-grow">
                  <select
                    value={row.fontFile}
                    onChange={(e) =>
                      handleFontFileChange(row.id, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a font</option>
                    {availableFonts.map((font, index) => (
                      <option key={index} value={font.name}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveRow(row.id)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  disabled={fontRows.length <= 1}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center mb-4">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center mb-4">
            <p className="text-green-500 font-medium">{success}</p>
          </div>
        )}

        <div className="flex justify-between items-center mt-6">
          <div>
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center px-4 py-2 border border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <FiPlus className="mr-1" /> Add Row
            </button>
          </div>

          <div className="space-x-3">
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:bg-indigo-300"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update"
                : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FontGroupForm;
