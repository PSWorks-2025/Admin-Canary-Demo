import React from "react";
import { ImageInput } from "../../../components/Inputs/ImageInput";
import { TextInput } from "../../../components/Inputs/TextInput";
const HeroSection = ({ heroTitle, heroDescription, heroImage, handleFieldChange, handleImageUpload,buttonColor }) => {
  return (
    <div
      className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${
          heroImage || "https://via.placeholder.com/1200x600"
        })`,
      }}
    >
      <ImageInput
        handleImageUpload={(file) => handleImageUpload("heroImage", file.target.files[0])}
        section="hero"
        top="top-23"
        right={"right-2"}
      />
      <div className="w-1/2 py-4 absolute bottom-30 left-10">
        <TextInput
          className="w-full text-[2.5rem] font-semibold text-white outline-none bg-transparent"
          value={heroTitle}
          onChange={(e) => handleFieldChange("heroTitle", e.target.value)}
          placeholder="Nhập tiêu đề câu chuyện"
        />
        <TextInput
          type="textarea"
          className="w-full text-base text-white outline-none bg-transparent resize-none"
          value={heroDescription}
          onChange={(e) => handleFieldChange("heroDescription", e.target.value)}
          placeholder="Nhập mô tả câu chuyện"
          rows="3"
        />
        <br />
        <button
          className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200 w-30"
          style={{backgroundColor:buttonColor}}
        >
          Đọc thêm
        </button>
      </div>
    </div>
  );
};

export default HeroSection;