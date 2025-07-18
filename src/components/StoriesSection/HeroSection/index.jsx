import React, { useState } from "react";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const HeroSection = ({ heroTitle, heroDescription, heroImage, handleFieldChange, handleImageUpload, buttonColor }) => {
  const [localTitle, setLocalTitle] = useState(heroTitle);
  const [localDescription, setLocalDescription] = useState(heroDescription);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleFieldChange = debounce(handleFieldChange, 500);

  const handleChange = (field, value) => {
    if (field === "title") {
      setLocalTitle(value);
    } else {
      setLocalDescription(value);
    }
    debouncedHandleFieldChange(field, value);
  };

  return (
    <div
   
    >
      <ImageInput
        handleImageUpload={(file) => handleImageUpload("image", file.target.files[0])}
        section="hero"
        top="top-23"
        right="right-2"
           className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${
          heroImage || "https://via.placeholder.com/1200x600"
        })`,
        height: "calc(100vh - 5rem)",
      }}
      >
      <div className="w-1/2 py-4 absolute bottom-30 left-10">
        <TextInput
          className="w-full text-[2.5rem] font-semibold text-white outline-none bg-transparent"
          value={localTitle}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Nhập tiêu đề câu chuyện"
        />
        <TextInput
          type="textarea"
          className="w-full text-base text-white outline-none bg-transparent resize-none"
          value={localDescription}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Nhập mô tả câu chuyện"
          rows="3"
        />
        <br />
        <button
          className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200 w-30"
          style={{ backgroundColor: buttonColor }}
        >
          Đọc thêm
        </button>
      </div>
      </ImageInput>
    </div>
  );
};

export default HeroSection;