import { useRef } from "react";

const VisionSection = ({ vision, handleNestedFieldChange, handleNestedImageUpload, visionImageRef }) => {
  return (
    <div className="w-full pt-20 flex flex-row-reverse">
      <div className="w-1/2 px-4 relative">
        <div
          className="w-162 h-102 -ml-26 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url("${vision.imageUrl}")` }}
        />
        <button
          className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
          onClick={() => visionImageRef.current.click()}
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
          ref={visionImageRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => handleNestedImageUpload("vision", "imageUrl", e.target.files[0])}
        />
      </div>
      <div className="w-1/2 px-4 flex items-center justify-end">
        <div className="w-136 h-62 rounded-lg bg-tag-2 text-primary-title shadow-[-1.5rem_-1.5rem_#E6EBFB] z-0">
          <input
            className="w-full font-bold text-[2.5rem] pt-12 text-center outline-none bg-transparent"
            value={vision.title}
            onChange={(e) => handleNestedFieldChange("vision", "title", e.target.value)}
            placeholder="Nhập tiêu đề tầm nhìn"
          />
          <textarea
            className="w-full px-8 text-base/5 font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
            value={vision.description}
            onChange={(e) => handleNestedFieldChange("vision", "description", e.target.value)}
            placeholder="Nhập mô tả tầm nhìn"
            rows="4"
          />
        </div>
      </div>
    </div>
  );
};

export default VisionSection;