import React from "react";
import { ImageInput } from "../../../components/Inputs/ImageInput";
import { TextInput } from "../../../components/Inputs/TextInput";
const HeroSection = ({ coverImage, backgroundColor, title, description, handleFieldChange, handleImageUpload }) => {
  return (
    <div className="relative">
        <ImageInput
          handleImageUpload={(e) => handleImageUpload("coverImage", e.target.files[0])}
          top="top-2"
          right="right-2"
            className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url("${coverImage || 'https://blog.photobucket.com/hubfs/upload_pics_online.png'}")`,
          height: "calc(100vh - 5rem)",
        }}
          section="hero"
        >
              <div className="w-280">
          <TextInput
            className="w-full text-[2.5rem] font-semibold text-secondary-title outline-none bg-transparent"
            value={title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <TextInput
            type="textarea"
            className="w-full text-secondary-title mb-6 outline-none bg-transparent resize-none"
            value={description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="4"
          />
        </div>
        </ImageInput>
    
    </div>
  );
};

export default HeroSection;