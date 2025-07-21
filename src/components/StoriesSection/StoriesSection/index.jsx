import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const StoriesSection = ({
  pageData,
  onFieldChange,
  onStoryFieldChange,
  onStoryImageUpload,
  onAddStory,
  onDeleteStory,
  buttonColor,
}) => {
  const [localHeading, setLocalHeading] = useState(pageData.heading);
  const [localStories, setLocalStories] = useState(pageData.stories);

  useEffect(() => {
    setLocalHeading(pageData.heading);
    setLocalStories(pageData.stories);
  }, [pageData]);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value, id, index) => {
      if (field === "heading") {
        const debouncedHandleFieldChange = debounce(onFieldChange, 500);
        setLocalHeading(value);
        debouncedHandleFieldChange(field, value);
      } else {
        const debouncedHandleStoryFieldChange = debounce(onStoryFieldChange, 500);
        setLocalStories((prev) => {
          const newStories = [...prev];
          newStories[index] = { ...newStories[index], [field]: value };
          return newStories;
        });
        debouncedHandleStoryFieldChange(id, field, value);
      }
    },
    [onFieldChange, onStoryFieldChange]
  );

  return (
    <div className="px-4">
      <TextInput
        className="mt-5 text-center font-bold md:text-2xl text-xl ml-5 sm:ml-0 w-full max-w-[600px] mx-auto outline-none bg-transparent"
        value={localHeading}
        onChange={(e) => handleChange("heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />

      {/* Mobile Display */}
      <div className="block sm:hidden mt-4 mb-5">
        {pageData.stories.map((story, index) => (
          <div key={story.id} className="flex flex-col items-center mb-6">
            <div className="relative w-full max-w-[300px] h-[300px] overflow-hidden rounded-lg mb-4">
              <ImageInput
                handleImageUpload={(e) => onStoryImageUpload(story.id, e.target.files[0])}
                section={`story-${story.id}`}
                top="top-2"
                left="left-2"
                className="w-full h-full object-cover"
                style={{ backgroundImage: `url("${story.imageUrl || 'https://via.placeholder.com/144x144'}")` }}
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => onDeleteStory(story.id)}
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
            <div className="text-content text-center max-w-[300px]">
              <TextInput
                className="text-lg font-semibold text-black outline-none bg-transparent w-full text-center"
                value={localStories[index]?.title || ""}
                onChange={(e) => handleChange("title", e.target.value, story.id, index)}
                placeholder="Nhập tiêu đề câu chuyện"
              />
              <TextInput
                type="textarea"
                className="text-sm px-3 text-black outline-none bg-transparent resize-none w-full"
                value={localStories[index]?.description || ""}
                onChange={(e) => handleChange("description", e.target.value, story.id, index)}
                placeholder="Nhập mô tả câu chuyện"
                rows="4"
              />
              <button
                className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200 mt-2"
                style={{ backgroundColor: buttonColor }}
              >
                Đọc thêm
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
            style={{ backgroundColor: buttonColor }}
            onClick={onAddStory}
          >
            Thêm câu chuyện
          </button>
        </div>
      </div>

      {/* Desktop Display */}
      <div className="hidden sm:block">
        {pageData.stories.map((story, index) => (
          <div key={story.id} className="flex flex-row justify-center items-start mt-10">
            <div className="image-container w-36 h-36 overflow-hidden rounded-lg mr-4 relative">
              <ImageInput
                handleImageUpload={(e) => onStoryImageUpload(story.id, e.target.files[0])}
                section={`story-${story.id}`}
                top="top-2"
                left="left-2"
                style={{ backgroundImage: `url("${story.imageUrl || 'https://via.placeholder.com/144x144'}")` }}
                className="w-full h-full object-cover bg-center"
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => onDeleteStory(story.id)}
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
            <div className="text-content max-w-md">
              <TextInput
                className="text-lg font-semibold text-black outline-none bg-transparent w-full"
                value={localStories[index]?.title || ""}
                onChange={(e) => handleChange("title", e.target.value, story.id, index)}
                placeholder="Nhập tiêu đề câu chuyện"
              />
              <TextInput
                type="textarea"
                className="text-base text-black outline-none bg-transparent resize-none w-full"
                value={localStories[index]?.description || ""}
                onChange={(e) => handleChange("description", e.target.value, story.id, index)}
                placeholder="Nhập mô tả câu chuyện"
                rows="4"
              />
              <button
                className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200 mt-2"
                style={{ backgroundColor: buttonColor }}
              >
                Đọc thêm
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <button
            className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
            style={{ backgroundColor: buttonColor }}
            onClick={onAddStory}
          >
            Thêm câu chuyện
          </button>
        </div>
      </div>
    </div>
  );
};

StoriesSection.propTypes = {
  pageData: PropTypes.shape({
    heading: PropTypes.string,
    stories: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        imageUrl: PropTypes.string,
        posted_time: PropTypes.string,
      })
    ),
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onStoryFieldChange: PropTypes.func.isRequired,
  onStoryImageUpload: PropTypes.func.isRequired,
  onAddStory: PropTypes.func.isRequired,
  onDeleteStory: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};

export default StoriesSection;