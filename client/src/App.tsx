import { useState } from "react";
import FontUpload from "./components/FontUpload";
import FontList from "./components/FontList";
import FontGroupForm from "./components/FontGroupForm";
import FontGroupList from "./components/FontGroupList";
import { FontGroup } from "./types";

function App() {
  const [refreshFontList, setRefreshFontList] = useState(0);
  const [refreshFontGroups, setRefreshFontGroups] = useState(0);
  const [editingGroup, setEditingGroup] = useState<FontGroup | null>(null);

  const handleFontUploaded = () => {
    setRefreshFontList((prev) => prev + 1);
  };

  const handleFontGroupCreated = () => {
    setRefreshFontGroups((prev) => prev + 1);
  };

  const handleEditGroup = (group: FontGroup) => {
    setEditingGroup(group);

    setTimeout(() => {
      const formElement = document.querySelector(".font-group-form-section");
      if (formElement) {
        formElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleEditComplete = () => {
    setEditingGroup(null);
    setRefreshFontGroups((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Font Group Manager
          </h1>
          <p className="text-lg text-indigo-600">
            Upload and organize your font collections
          </p>
        </header>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <FontUpload onFontUploaded={handleFontUploaded} />
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <FontList
              refreshTrigger={refreshFontList}
              onFontDeleted={() => setRefreshFontList((prev) => prev + 1)}
            />
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 font-group-form-section">
            <FontGroupForm
              onGroupCreated={handleFontGroupCreated}
              editingGroup={editingGroup}
              onEditComplete={handleEditComplete}
            />
          </section>

          <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <FontGroupList
              refreshTrigger={refreshFontGroups}
              onEditGroup={handleEditGroup}
            />
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
