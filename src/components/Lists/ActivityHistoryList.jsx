import { MdCircle } from "react-icons/md";
import { BiSolidRightArrow } from "react-icons/bi";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
import React, { useState } from "react";

export function ActivityHistoryList({ children }) {
  return (
    <div className="w-full">
      {children.map((activity, index) => (
        <div
          key={`activity_${index}`}
          className={`w-full ${index % 2 === 1 ? "flex flex-row-reverse" : "flex"}`}
        >
          {activity}
        </div>
      ))}
    </div>
  );
}

ActivityHistoryList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

export function ActivityHistoryListItem({
  index,
  startDate,
  endDate,
  imageUrl1,
  imageUrl2,
  description,
  onChange,
  onImageUpload,
  onDelete,
  buttonColor,
}) {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);
  const [localDescription, setLocalDescription] = useState(description);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleChange = (field, value) => {
    const debouncedHandleChange = debounce(onChange, 500);
    if (field === "started_time") {
      setLocalStartDate(value);
    } else if (field === "ended_time") {
      setLocalEndDate(value);
    } else if (field === "text") {
      setLocalDescription(value);
    } else if (field === "delete") {
      onDelete();
      return;
    }
    debouncedHandleChange(field, value);
  };

  return (
    <div className="relative">
      <div className="w-full h-84 mt-12 md:mt-8 flex">
        <div className="w-1/2 h-full px-4">
          <div className="w-136 h-full float-right relative">
            <div>
              <ImageInput
                handleImageUpload={(file) => onImageUpload("image1", file)}
                className="absolute w-88 h-62 bg-cover bg-center rounded-lg top-0 left-0"
                style={{ backgroundImage: `url("${imageUrl1}")` }}
                section="activity"
                top="top-2"
                left="left-2"
              />
            </div>
            <div>
              <ImageInput
                className="absolute w-88 h-47 bg-cover bg-center rounded-lg bottom-0 right-0"
                style={{ backgroundImage: `url("${imageUrl2}")` }}
                handleImageUpload={(file) => onImageUpload("image2", file)}
                section="activity"
                top="top-2"
                right="right-2"
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full px-4">
          <div className="w-136 h-full">
            <div className="w-83 flex justify-between text-[1.6rem] font-bold text-primary-title">
              <TextInput
                className="w-50 text-[1.6rem] font-bold text-primary-title outline-none bg-transparent"
                value={localStartDate || ""}
                type="date"
                onChange={(e) => handleChange("started_time", e.target.value)}
                placeholder="Start date"
              />
              <TextInput
                className="w-50 text-[1.6rem] font-bold text-primary-title outline-none bg-transparent"
                value={localEndDate || ""}
                type="date"
                onChange={(e) => handleChange("ended_time", e.target.value)}
                placeholder="End date"
              />
            </div>
            <div className="flex items-center py-2">
              <MdCircle className="w-5 h-5 mr-0.5" style={{ color: buttonColor }} />
              <div className="w-72 h-0.75 rounded-full" style={{ backgroundColor: buttonColor }}></div>
              <BiSolidRightArrow className="w-3.5 h-3.5 -ml-1" style={{ color: buttonColor }} />
              <MdCircle className="w-5 h-5 mx-0.5" style={{ color: buttonColor }} />
              <div className="w-20 h-0.75 rounded-full" style={{ backgroundColor: buttonColor }}></div>
            </div>
            <TextInput
              type="textarea"
              className="w-136 text-base/5 pt-2 text-primary-paragraph outline-none bg-transparent resize-none"
              value={localDescription}
              onChange={(e) => handleChange("text", e.target.value)}
              placeholder="Nhập mô tả hoạt động"
              rows="4"
            />
          </div>
        </div>
      </div>
      <button
        className="absolute top-2 -right-2/2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
        onClick={() => handleChange("delete", null)}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

ActivityHistoryListItem.propTypes = {
  index: PropTypes.number.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  imageUrl1: PropTypes.string.isRequired,
  imageUrl2: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};