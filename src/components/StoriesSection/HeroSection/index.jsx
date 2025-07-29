import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const HeroSection = ({
  title,
  description,
  backgroundImage,
  setHeroSections,
  enqueueImageUpload,
  setHasChanges,
  buttonColor,
}) => {
  const [localTitle, setLocalTitle] = useState(title || "");
  const [localDescription, setLocalDescription] = useState(description || "");
  const navigate = useNavigate();

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`HeroSection[stories]: Updating ${field} to ${value}`);
      const debouncedUpdate = debounce((field, value) => {
        setHeroSections((prev) => ({
          ...prev,
          stories: { ...prev.stories, [field]: value },
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
    (file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`HeroSection[stories]: Enqueuing image for image`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero/stories/${file.name}`;
        enqueueImageUpload(`main_pages.hero_sections.stories.image`, storagePath, file);
        setHeroSections((prev) => ({
          ...prev,
          stories: { ...prev.stories, image: blobUrl },
        }));
        setHasChanges(true);
      } else {
        console.error(`HeroSection[stories]: Invalid file for image:`, file);
      }
    },
    [enqueueImageUpload, setHeroSections, setHasChanges]
  );

  const handleReadMore = (e) => {
    e.stopPropagation();
      navigate("/edit-content", {
      state: {
        id: "story_hero",
        title: localTitle,
        thumbnail: backgroundImage
      },
    });
  };

  return (
    <div>
      <ImageInput
        handleImageUpload={(e) => handleImageUpload(e.target.files[0])}
        section="hero"
        top="top-2 sm:top-23"
        right="right-2"
        className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${backgroundImage || "https://blog.photobucket.com/hubfs/upload_pics_online.png"})`,
          height: "80vh sm:90vh md:calc(100vh - 5rem)",
        }}
      >
        <div className="w-full sm:w-3/4 md:w-1/2 py-2 sm:py-4 absolute left-4 sm:left-10">
          <TextInput
            className="w-full text-2xl sm:text-3xl md:text-[2.5rem] font-semibold text-white outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề câu chuyện"
          />
          <TextInput
            type="textarea"
            className="w-full text-sm sm:text-base text-white outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả câu chuyện"
            rows="3 sm:4"
          />
          <button
            onClick={handleReadMore}
            className="text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:opacity-50 transition-opacity duration-200 text-sm sm:text-base mt-2 sm:mt-4"
            style={{ backgroundColor: buttonColor }}
          >
            Đọc thêm
          </button>
        </div>
      </ImageInput>
    </div>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  backgroundImage: PropTypes.string,
  setHeroSections: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};

export default HeroSection;