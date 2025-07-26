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
      console.log(`VisionSection: Updating ${field} to ${value}`);
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
        console.log(`VisionSection: Enqueuing image for ${field}`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `about/statements/vision/${file.name}`;
        enqueueImageUpload(`main_pages.statements.vision.${field}`, storagePath, file);
        setStatements((prev) => ({
          ...prev,
          vision: { ...prev.vision, [field]: blobUrl },
        }));
        setHasChanges(true);
      } else {
        console.error(`VisionSection: Invalid file for ${field}:`, file);
      }
    },
    [enqueueImageUpload, setStatements, setHasChanges]
  );

  return (
    <div className="w-full pt-20 flex flex-row-reverse">
      <div className="w-1/2 px-4 relative">
        <ImageInput
          handleImageUpload={(e) => handleImageUpload("imageUrl", e.target.files[0])}
          className="w-162 h-102 -ml-26 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url("${vision?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
          section="vision"
          top="top-2"
          left="left-2"
        />
      </div>
      <div className="w-1/2 px-4 flex items-center justify-end">
        <div className="w-136 h-62 rounded-lg bg-tag-2 text-primary-title shadow-[-1.5rem_-1.5rem_#E6EBFB] z-0">
          <TextInput
            className="w-full font-bold text-[2.5rem] pt-12 text-center outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề tầm nhìn"
          />
          <TextInput
            type="textarea"
            className="w-full px-8 text-base/5 font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả tầm nhìn"
            rows="4"
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