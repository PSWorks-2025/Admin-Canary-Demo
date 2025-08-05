import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../../../Inputs/ImageInput";
import { TextInput } from "../../../Inputs/TextInput";

const MissionSection = ({ mission, setStatements, enqueueImageUpload, enqueueImageDelete, setHasChanges }) => {
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
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `main_pages/statements/mission/image.jpg`;
        enqueueImageUpload({
          key: `main_pages.statements.mission.${field}`,
          path: storagePath,
          file,
          oldUrl: mission?.imageUrl,
        });
        setStatements((prev) => ({
          ...prev,
          mission: { ...prev.mission, [field]: blobUrl },
        }));
        setHasChanges(true);
      }
    },
    [enqueueImageUpload, setStatements, setHasChanges, mission?.imageUrl]
  );

  return (
    <div className="w-[80%] mx-auto pt-8 md:pt-12 flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 px-2 sm:px-4 relative mb-4 md:mb-0">
        <ImageInput
          handleImageUpload={(e) => handleImageUpload("imageUrl", e.target.files[0])}
          section="mission"
          top="top-2"
          className="w-[90%] h-64 md:h-80 lg:h-120 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url("${mission?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
        />
      </div>
      <div className="w-full md:w-1/2 px-2 sm:px-4 flex items-center">
        <div className="w-full rounded-lg bg-tag-2 text-primary-title shadow-[1rem_-1rem_#E6EBFB] z-20 p-20">
          <TextInput
            className="w-full font-bold text-xl md:text-2xl lg:text-[2.5rem] text-center outline-none bg-transparent"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề sứ mệnh"
          />
          <TextInput
            type="textarea"
            className="w-full px-4 text-sm md:text-base font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả sứ mệnh"
            rows="3"
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
  enqueueImageDelete: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
};

export default MissionSection;