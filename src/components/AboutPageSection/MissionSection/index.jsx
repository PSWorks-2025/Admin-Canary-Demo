import React, { useState, useCallback } from "react";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const MissionSection = ({ mission, onFieldChange, onImageUpload }) => {
  const [localTitle, setLocalTitle] = useState(mission.title);
  const [localDescription, setLocalDescription] = useState(mission.description);

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
    <div className="w-full pt-20 flex">
      <div className="w-1/2 px-4 relative">
        <ImageInput
          handleImageUpload={(file) => onImageUpload("imageUrl", file.target.files[0])}
          section="mission"
          top="top-2"
          className="w-162 h-102 -mr-26 bg-cover bg-center float-right rounded-lg"
          style={{ backgroundImage: `url("${mission.imageUrl}")` }}
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

export default MissionSection;