import React, { useState, useCallback } from "react";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const HeroSection = ({ title, description, backgroundImage, onFieldChange, onImageUpload }) => {
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
    <div>
      <ImageInput
        handleImageUpload={(e) => onImageUpload(e.target.files[0])}
        top="top-23"
        right="right-2"
        section="hero"
        className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url("${backgroundImage}")`,
          height: "calc(100vh - 5rem)",
        }}
      >
        <div className="w-1/2 absolute left-10">
          <TextInput
            className="w-full text-[2.5rem] font-semibold text-white outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <TextInput
            type="textarea"
            className="w-full text-base text-white mb-6 outline-none bg-transparent resize-none"
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