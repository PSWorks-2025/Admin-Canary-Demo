import React from "react";
import { ImageInput } from "../../../components/Inputs/ImageInput";
import { TextInput } from "../../../components/Inputs/TextInput";
const HeroSection = ({ title, description, backgroundImage, handleFieldChange, handleImageUpload }) => {
  return (
    <div
      className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
        height: "calc(100vh - 5rem)",
      }}
    >
      <ImageInput
        handleImageUpload={e => handleImageUpload(e.target.files[0])}
        top="top-24"
        right="right-2"
        section={"hero"}
      />
      <div className="w-1/2 absolute left-10">
        <TextInput
          className="w-full text-[2.5rem] font-semibold text-white outline-none bg-transparent"
          value={title}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          placeholder="Nhập tiêu đề"
        />
        <TextInput
          type="textarea"
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