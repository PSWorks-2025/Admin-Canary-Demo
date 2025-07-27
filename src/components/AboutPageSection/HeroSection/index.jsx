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
      console.log(`HeroSection: Updating ${field} to ${value}`);
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
        console.log(`HeroSection: Enqueuing image for ${field}`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero_sections/about/${file.name}`;
        enqueueImageUpload(`main_pages.hero_sections.about.${field}`, storagePath, file);
        setHeroSections((prev) => ({
          ...prev,
          about: { ...prev.about, [field]: blobUrl },
        }));
        setHasChanges(true);
      } else {
        console.error(`HeroSection: Invalid file for ${field}:`, file);
      }
    },
    [enqueueImageUpload, setHeroSections, setHasChanges]
  );

  return (
    <div className="relative">
      <ImageInput
        handleImageUpload={(e) => handleImageUpload("coverImage", e.target.files[0])}
        top="top-2"
        right="right-2"
        className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url("${coverImage || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")`,
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
            section="hero"
          />
          <TextInput
            type="textarea"
            className="w-full text-secondary-title mb-6 outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="4"
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