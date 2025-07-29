import { useState } from "react";

const SaveFloatingButton = ({ visible = true, onClick }) => {
  const [expanded, setExpanded] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 cursor-pointer">
      <div
        className={`flex items-center ${
          expanded ? 'w-auto px-2 py-1' : 'w-12 h-12 justify-center'
        } bg-green-600 rounded-full shadow-lg overflow-hidden cursor-pointer`}
      >
        {expanded && (
          <button
            onClick={onClick}
            className="text-white font-semibold px-4 py-2 cursor-pointer"
          >
            Lưu thay đổi
          </button>
        )}
        <button
          className={`text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
            expanded ? 'ml-2' : ''
          }`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? '➖' : '➕'}
        </button>
      </div>
    </div>
  );
};

export default SaveFloatingButton