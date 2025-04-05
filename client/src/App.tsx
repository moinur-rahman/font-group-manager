import { useState } from "react";
import FontUpload from "./components/FontUpload";
import FontList from "./components/FontList";

function App() {
  const [refreshFontList, setRefreshFontList] = useState(0);

  const handleFontUploaded = () => {
    setRefreshFontList((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Font Group Manager
          </h1>
          <p className="text-lg text-indigo-600">
            Upload and organize your font collections
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <FontUpload onFontUploaded={handleFontUploaded} />
          <FontList
            refreshTrigger={refreshFontList}
            onFontDeleted={() => setRefreshFontList((prev) => prev + 1)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
