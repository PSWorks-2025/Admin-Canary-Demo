import { useRef } from "react";

const HeroSection = ({ coverImage, backgroundColor, title, description, handleFieldChange, handleImageUpload, coverInputRef }) => {
  return (
    <div className="relative">
      <div
        className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url("${coverImage}")`,
          height: "calc(100vh - 5rem)",
        }}
      >
        <button
          className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
          onClick={() => coverInputRef.current.click()}
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
          ref={coverInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageUpload("coverImage", e.target.files[0])}
        />
        <input
          type="color"
          className="absolute top-2 right-2 w-8 h-8 rounded-full cursor-pointer z-10"
          value={backgroundColor}
          onChange={(e) => handleFieldChange("backgroundColor", e.target.value)}
        />
        <div className="w-280">
          <input
            className="w-full text-[2.5rem] font-semibold text-secondary-title outline-none bg-transparent"
            value={title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <textarea
            className="w-full text-secondary-title mb-6 outline-none bg-transparent resize-none"
            value={description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="4"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;