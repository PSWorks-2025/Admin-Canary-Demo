import React from "react";

const HeroSection = ({ heroTitle, heroDescription, heroImage, handleFieldChange, handleImageUpload, heroImageRef }) => {
  return (
    <div
      className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${
          heroImage || "https://via.placeholder.com/1200x600"
        })`,
      }}
    >
      <button
        className="absolute top-2 left-2 p-2 bg-[#e6ebf5] text-white rounded-full cursor-pointer z-10"
        onClick={() => heroImageRef.current.click()}
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
        ref={heroImageRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageUpload("heroImage", e.target.files[0])}
      />
      <div className="w-1/2 py-4 absolute bottom-30 left-10">
        <input
          className="w-full text-[2.5rem] font-semibold text-white outline-none bg-transparent"
          value={heroTitle}
          onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
          placeholder="Nhập tiêu đề câu chuyện"
        />
        <textarea
          className="w-full text-base text-white outline-none bg-transparent resize-none"
          value={heroDescription}
          onChange={(e) => handleFieldChange("heroDescription", e.target.value)}
          placeholder="Nhập mô tả câu chuyện"
          rows="3"
        />
        <br />
        <button
          className="text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200 w-30"
        >
          Đọc thêm
        </button>
      </div>
    </div>
  );
};

export default HeroSection;