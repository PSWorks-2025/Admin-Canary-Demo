import React, { useState, useCallback } from "react";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function ProjectOverview({ pageData, onFieldChange, onImageUpload, buttonColor }) {
  const [localHeading, setLocalHeading] = useState(pageData.heading);
  const [localTitle, setLocalTitle] = useState(pageData.title);
  const [localDescription, setLocalDescription] = useState(pageData.description);
  const [localStartedTime, setLocalStartedTime] = useState(pageData.started_time);

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
      if (field === "heading") {
        setLocalHeading(value);
      } else if (field === "title") {
        setLocalTitle(value);
      } else if (field === "started_time") {
        setLocalStartedTime(value);
      } else {
        setLocalDescription(value);
      }
      debouncedHandleFieldChange(
        Object.keys(pageData.project_overviews || {})[0] || `Dự Án_0_${new Date().toISOString()}`,
        field,
        value
      );
    },
    [onFieldChange, pageData.project_overviews]
  );

  return (
    <section style={{ borderTopColor: buttonColor, borderTopWidth: 2 }} className="px-8 py-8">
      <TextInput
        className="w-full text-[2.5rem] font-bold text-black outline-none bg-transparent text-center mb-6"
        value={localHeading}
        onChange={(e) => handleChange("heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="flex flex-row justify-center gap-10">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-5 relative w-[600px] max-w-full">
            {pageData.images.map((image, index) => (
              <div key={index} className="relative w-full h-full">
                <ImageInput
                  handleImageUpload={(file) =>
                    onImageUpload(
                      Object.keys(pageData.project_overviews || {})[index] || `Dự Án_${index}_${new Date().toISOString()}`,
                      file
                    )
                  }
                  top={index === 2 ? "-top-[60%]" : index === 4 ? "-top-55" : "top-2"}
                  left={index === 2 ? "left-1/2" : "left-2"}
                  section={`project_${index}`}
                  className={`w-full h-[200px] bg-center object-cover rounded-xl shadow-md ${
                    index === 2 ? "absolute scale-105 z-10 -top-[60%] left-1/2" : index === 4 ? "absolute -top-55" : ""
                  }`}
                  style={{ backgroundImage: `url("${image}")` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/5 ml-10">
          <TextInput
            className="w-full max-w-[400px] text-xl font-semibold text-black outline-none mx-auto mb-2"
            value={localTitle}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Nhập tiêu đề dự án"
          />
          <TextInput
            type="textarea"
            className="w-full max-w-[400px] text-base text-[#333333] mb-2 outline-none bg-transparent resize-none"
            value={localDescription}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Nhập mô tả dự án"
            rows="5"
          />
          <TextInput
            type="date"
            className="w-full max-w-[400px] text-base text-[#333333] mb-2 outline-none bg-transparent"
            value={localStartedTime}
            onChange={(e) => handleChange("started_time", e.target.value)}
            placeholder="Chọn ngày bắt đầu"
          />
          <br />
          <button
            className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
            style={{ backgroundColor: buttonColor }}
          >
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverview;