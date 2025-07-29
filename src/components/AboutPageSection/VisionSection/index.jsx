import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const VisionSection = ({ vision, setStatements, enqueueImageUpload, setHasChanges }) => {
  const [localTitle, setLocalTitle] = useState(vision?.title || "");
  const [localDescription, setLocalDescription] = useState(vision?.description || "");

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
        setStatements((prev) => ({
          ...prev,
          vision: { ...prev.vision, [field]: value },
        }));
        setHasChanges(true);
      }, 500);
      if (field === "title") setLocalTitle(value);
      else setLocalDescription(value);
      debouncedUpdate(field, value);
    },
    [setStatements, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (field, file) => {
      if (file instanceof File || file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `about/statements/vision/${file.name}`;
        enqueueImageUpload(`main_pages.statements.vision.${field}`, storagePath, file);
        setStatements((prev) => ({
          ...prev,
          vision: { ...prev.vision, [field]: blobUrl },
        }));
        setHasChanges(true);
      }
    },
    [enqueueImageUpload, setStatements, setHasChanges]
  );

  return (
    <div className="w-[80%] mx-auto pt-8 md:pt-12 flex flex-col-reverse md:flex-row-reverse">
      <div className="w-full md:w-1/2 px-2 sm:px-4 relative mb-4 md:mb-0">
        <ImageInput
          handleImageUpload={(e) => handleImageUpload("imageUrl", e.target.files[0])}
          className="w-[90%] h-64 md:h-80 lg:h-120 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url("${vision?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
          section="vision"
          top="top-2"
        />
      </div>
      <div className="w-full md:w-1/2 px-2 sm:px-4 flex items-center justify-end">
        <div className="w-full rounded-lg bg-tag-2 text-primary-title shadow-[-1rem_-1rem_#E6EBFB] z-0 p-20">
          <TextInput
            className="w-full font-bold text-xl md:text-2xl lg:text-[2.5rem] text-center outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề tầm nhìn"
          />
          <TextInput
            type="textarea"
            className="w-full px-4 text-sm md:text-base font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả tầm nhìn"
            rows="3"
          />
        </div>
      </div>
    </div>
  );
};

VisionSection.propTypes = {
  vision: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  setStatements: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
};

export default VisionSection;