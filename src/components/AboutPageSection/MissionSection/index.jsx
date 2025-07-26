import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const MissionSection = ({ mission, setStatements, enqueueImageUpload, setHasChanges }) => {
  const [localTitle, setLocalTitle] = useState(mission?.title || "");
  const [localDescription, setLocalDescription] = useState(mission?.description || "");

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`MissionSection: Updating ${field} to ${value}`);
      const debouncedUpdate = debounce((field, value) => {
        setStatements((prev) => ({
          ...prev,
          mission: { ...prev.mission, [field]: value },
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
        console.log(`MissionSection: Enqueuing image for ${field}`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `about/statements/mission/${file.name}`;
        enqueueImageUpload(`main_pages.statements.mission.${field}`, storagePath, file);
        setStatements((prev) => ({
          ...prev,
          mission: { ...prev.mission, [field]: blobUrl },
        }));
        setHasChanges(true);
      } else {
        console.error(`MissionSection: Invalid file for ${field}:`, file);
      }
    },
    [enqueueImageUpload, setStatements, setHasChanges]
  );

  return (
    <div className="w-full pt-20 flex">
      <div className="w-1/2 px-4 relative">
        <ImageInput
          handleImageUpload={(e) => handleImageUpload("imageUrl", e.target.files[0])}
          section="mission"
          top="top-2"
          className="w-162 h-102 -mr-26 bg-cover bg-center float-right rounded-lg"
          style={{ backgroundImage: `url("${mission?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
          left="left-1/2"
        />
      </div>
      <div className="w-1/2 px-4 flex items-center">
        <div className="w-136 h-62 rounded-lg bg-tag-2 text-primary-title shadow-[1.5rem_-1.5rem_#E6EBFB] z-20">
          <TextInput
            className="w-full font-bold text-[2.5rem] pt-12 text-center outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề sứ mệnh"
          />
          <TextInput
            type="textarea"
            className="w-full px-8 text-base/5 font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả sứ mệnh"
            rows="4"
          />
        </div>
      </div>
    </div>
  );
};

MissionSection.propTypes = {
  mission: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  setStatements: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
};

export default MissionSection;