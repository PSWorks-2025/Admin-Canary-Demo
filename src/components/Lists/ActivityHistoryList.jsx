import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { MdCircle } from "react-icons/md";
import { BiSolidRightArrow } from "react-icons/bi";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

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
  setActivityHistory,
  enqueueImageUpload,
  enqueueImageDelete,
  setHasChanges,
  buttonColor,
}) {
  const [localStartDate, setLocalStartDate] = useState(() => {
    if (!startDate) return "";
    try {
      const date = startDate?.toDate ? startDate.toDate() : new Date(startDate);
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      return "";
    } catch (error) {
      console.error(`Invalid startDate for activity ${index}:`, startDate, error);
      return "";
    }
  });
  const [localEndDate, setLocalEndDate] = useState(() => {
    if (!endDate) return "";
    try {
      const date = endDate?.toDate ? endDate.toDate() : new Date(endDate);
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
      return "";
    } catch (error) {
      console.error(`Invalid endDate for activity ${index}:`, endDate, error);
      return "";
    }
  });
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
      console.log(`ActivityHistoryListItem[${index}]: Updating ${field} to ${value}`);
      if ((field === "started_time" || field === "ended_time") && value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          console.error(`Invalid date for ${field}: ${value}`);
          return;
        }
      }
      const debouncedUpdate = debounce((field, value) => {
        setActivityHistory((prev) =>
          prev.map((activity, i) =>
            i === index ? { ...activity, [field]: value } : activity
          )
        );
        setHasChanges(true);
      }, 500);
      if (field === "started_time") setLocalStartDate(value);
      else if (field === "ended_time") setLocalEndDate(value);
      else setLocalDescription(value);
      debouncedUpdate(field, value);
    },
    [index, setActivityHistory, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (field, file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`ActivityHistoryListItem[${index}]: Enqueuing image for ${field}`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `main_pages/activity_history/${index}/${field}.jpg`;
        enqueueImageUpload({
          key: `main_pages.activity_history.${index}.${field}`,
          path: storagePath,
          file,
          oldUrl: field === 'image1' ? imageUrl1 : imageUrl2,
        });
        setActivityHistory((prev) =>
          prev.map((activity, i) =>
            i === index ? { ...activity, [field]: blobUrl } : activity
          )
        );
        setHasChanges(true);
      } else {
        console.error(`ActivityHistoryListItem[${index}]: Invalid file for ${field}:`, file);
      }
    },
    [index, enqueueImageUpload, setActivityHistory, setHasChanges, imageUrl1, imageUrl2]
  );

  const handleDelete = useCallback(() => {
    console.log(`ActivityHistoryListItem[${index}]: Deleting activity`);
    if (imageUrl1 && !imageUrl1.startsWith('https://via.placeholder.com')) {
      enqueueImageDelete(`main_pages/activity_history/${index}/image1.jpg`);
    }
    if (imageUrl2 && !imageUrl2.startsWith('https://via.placeholder.com')) {
      enqueueImageDelete(`main_pages/activity_history/${index}/image2.jpg`);
    }
    setActivityHistory((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  }, [index, setActivityHistory, enqueueImageDelete, setHasChanges, imageUrl1, imageUrl2]);

  return (
    <div className="relative">
      <div className="w-full h-84 mt-12 md:mt-8 flex">
        <div className="w-1/2 h-full px-4">
          <div className="w-136 h-full float-right relative">
            <div>
              <ImageInput
                handleImageUpload={(e) => handleImageUpload("image1", e.target.files[0])}
                className="absolute w-88 h-62 bg-cover bg-center rounded-lg top-0 left-0"
                style={{ backgroundImage: `url("${imageUrl1 || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
                section="activity"
                top="top-2"
                left="left-2"
              />
            </div>
            <div>
              <ImageInput
                className="absolute w-88 h-47 bg-cover bg-center rounded-lg bottom-0 right-0"
                style={{ backgroundImage: `url("${imageUrl2 || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
                handleImageUpload={(e) => handleImageUpload("image2", e.target.files[0])}
                section="activity"
                top="top-2"
                right="right-2"
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full">
          <div className="w-136 h-full">
            <div className="w-83 flex justify-between text-[1.6rem] font-bold text-primary-title">
              <TextInput
                className="w-60 text-[1.6rem] font-bold text-primary-title outline-none bg-transparent"
                value={localStartDate}
                type="date"
                onChange={(e) => handleChange("started_time", e.target.value)}
                placeholder="Start date"
              />
              <TextInput
                className="w-60 text-[1.6rem] font-bold text-primary-title outline-none bg-transparent"
                value={localEndDate}
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
        className="absolute top-2 -right-4/3 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
        onClick={handleDelete}
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
  startDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.shape({ toDate: PropTypes.func }), // Firebase Timestamp
  ]),
  endDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.shape({ toDate: PropTypes.func }), // Firebase Timestamp
  ]),
  imageUrl1: PropTypes.string,
  imageUrl2: PropTypes.string,
  description: PropTypes.string,
  setActivityHistory: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  enqueueImageDelete: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};