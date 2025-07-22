import React, { useState, useCallback } from "react";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const HeroSection = ({ coverImage, backgroundColor, title, description, onFieldChange, onImageUpload }) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      const debouncedHandleFieldChange = debounce(onFieldChange, 500);
      if (field === "title") {
        setLocalTitle(value);
      } else {
        setLocalDescription(value);
      }
      debouncedHandleFieldChange(field, value);
    },
    [onFieldChange]
  );

  return (
    <div className="relative">
      <ImageInput
        handleImageUpload={(e) => onImageUpload("coverImage", e.target.files[0])}
        top="top-2"
        right="right-2"
        className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url("${coverImage}")`,
          height: "calc(100vh - 5rem)",
        }}
        section="hero"
      >
        <div className="w-280">
          <TextInput
            className="w-full text-[2.5rem] font-semibold text-secondary-title outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <TextInput
            type="textarea"
            className="w-full text-secondary-title mb-6 outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="4"
          />
        </div>
      </ImageInput>
    </div>
  );
};

export default HeroSection;