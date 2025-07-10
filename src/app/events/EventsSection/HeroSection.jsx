import React from "react";

const HeroSection = ({ title, description, backgroundImage, handleFieldChange, handleImageUpload, imageInputRef }) => {
  return (
    <div
      className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        height: "calc(100vh - 5rem)",
      }}
    >
      <button
        className="absolute top-2 left-2 p-2 bg-[#e6ebf5] text-white rounded-full cursor-pointer z-10"
        onClick={() => imageInputRef.current.click()}
      >
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
      </button>
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
      <div className="w-1/2 absolute left-10">
        <input
          className="w-full text-[2.5rem] font-semibold text-white outline-none bg-transparent"
          value={title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="Nhập tiêu đề"
        />
        <textarea
          className="w-full text-base text-white mb-6 outline-none bg-transparent resize-none"
          value={description}
          onChange={(e) => handleFieldChange("description", e.target.value)}
          placeholder="Nhập mô tả"
          rows="4"
        />
      </div>
    </div>
  );
};

export default HeroSection;