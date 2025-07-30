import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const HeroSection = ({
  coverImage,
  backgroundColor,
  title,
  description,
  setHeroSections,
  enqueueImageUpload,
  setHasChanges,
}) => {
  const [localTitle, setLocalTitle] = useState(title || "");
  const [localDescription, setLocalDescription] = useState(description || "");

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      const debouncedUpdate = debounce((field, value) => {
        setHeroSections((prev) => ({
          ...prev,
          about: { ...prev.about, [field]: value },
        }));
        setHasChanges(true);
      }, 500);
      if (field === "title") setLocalTitle(value);
      else setLocalDescription(value);
      debouncedUpdate(field, value);
    },
    [setHeroSections, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (field, file) => {
      if (file instanceof File || file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero_sections/about/${file.name}`;
        enqueueImageUpload(`main_pages.hero_sections.about.${field}`, storagePath, file);
        setHeroSections((prev) => ({
          ...prev,
          about: { ...prev.about, [field]: blobUrl },
        }));
        setHasChanges(true);
      }
    },
    [enqueueImageUpload, setHeroSections, setHasChanges]
  );

  return (
    <div className="relative w-full">
      <ImageInput
        handleImageUpload={(e) => handleImageUpload("coverImage", e.target.files[0])}
        className="w-full h-96 md:h-128 lg:h-[80vh] bg-cover bg-bottom flex justify-center items-end bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url("${coverImage || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")`,
        }}
        section="hero"
      >
        <div className="w-full px-2 sm:px-4 pb-4">
          <TextInput
            className="ml-8 sm:mb-2 md:mb-4 p-2 w-full text-xl md:text-2xl lg:text-[2.5rem] font-semibold text-secondary-title outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề"
            section="hero"
          />
          <TextInput
            type="textarea"
            className="ml-8 sm:mb-2 md:mb-4 p-2 w-full text-sm md:text-base text-secondary-title outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="3"
            section="hero"
          />
        </div>
      </ImageInput>
    </div>
  );
};

HeroSection.propTypes = {
  coverImage: PropTypes.string,
  backgroundColor: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  setHeroSections: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
};

export default HeroSection;