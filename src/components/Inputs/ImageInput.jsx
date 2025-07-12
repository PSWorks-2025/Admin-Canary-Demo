import React, { useRef } from "react";

export const ImageInput = ({ handleImageUpload, section, top, left, right }) => {
  const inputRef = useRef();

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <button
        onClick={triggerFileInput}
        className={`absolute ${top} ${right} ${left} ${
          section === "hero" ? "py-2 px-4" : section==="logo" ? "p-0" : "p-2"
        } rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title z-10`}
      >
        {section === "hero" ? (
          <p>Upload Image</p>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
            />
          </svg>
        )}
      </button>
    </>
  );
};
