import React from "react";
import { ImageInput } from "../../../components/Inputs/ImageInput";
import { TextInput } from "../../../components/Inputs/TextInput";
const StoriesSection = ({
  heading,
  stories,
  handleFieldChange,
  handleStoryFieldChange,
  handleStoryImageUpload,
  addStory,
  deleteStory,
  buttonColor
}) => {
  return (
    <div className="px-4">
      <TextInput
        className="mt-5 text-center font-bold md:text-2xl text-xl ml-5 sm:ml-0 w-full max-w-[600px] mx-auto outline-none bg-transparent"
        value={heading}
        onChange={(e) => handleFieldChange("heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />

      {/* Mobile Display */}
      <div className="block sm:hidden mt-4 mb-5">
        {stories.map((story, index) => (
          <div key={index} className="flex flex-col items-center mb-6">
            <div className="relative w-full max-w-[300px] h-[300px] overflow-hidden rounded-lg mb-4">
              <img
                src={story.imageUrl || "https://via.placeholder.com/300x300"}
                alt="Câu chuyện"
                className="w-full h-full object-cover"
              />
              <ImageInput
                handleImageUpload={(file) => handleStoryImageUpload(index, file.target.files[0])}
                section={`story-${index}`}
                top="top-2"
                left="left-2"
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => deleteStory(index)}
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
                value={story.title}
                onChange={(e) => handleStoryFieldChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề câu chuyện"
              />
              <TextInput
                type="textarea"
                className="text-sm px-3 text-black outline-none bg-transparent resize-none w-full"
                value={story.description}
                onChange={(e) => handleStoryFieldChange(index, "description", e.target.value)}
                placeholder="Nhập mô tả câu chuyện"
                rows="4"
              />
              <button
                className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200 mt-2"
                style={{backgroundColor:buttonColor}}
              >
                Đọc thêm
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center">
          <button
            className="text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200"
            onClick={addStory}
          >
            Thêm câu chuyện
          </button>
        </div>
      </div>

      {/* Desktop Display */}
      <div className="hidden sm:block">
        {stories.map((story, index) => (
          <div key={index} className="flex flex-row justify-center items-start mt-10">
            <div className="image-container w-36 h-36 overflow-hidden rounded-lg mr-4 relative">
              <img
                src={story.imageUrl || "https://via.placeholder.com/144x144"}
                alt="Câu chuyện"
                className="w-full h-full object-cover"
              />
              <ImageInput
                handleImageUpload={(file) => handleStoryImageUpload(index, file.target.files[0])}
                section={`story-${index}`}
                top="top-2"
                left="left-2"
              />
             
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => deleteStory(index)}
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
                value={story.title}
                onChange={(e) => handleStoryFieldChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề câu chuyện"
              />
              <TextInput
                type="textarea"
                className="text-base text-black outline-none bg-transparent resize-none w-full"
                value={story.description}
                onChange={(e) => handleStoryFieldChange(index, "description", e.target.value)}
                placeholder="Nhập mô tả câu chuyện"
                rows="4"
              />
              <button
                className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200 mt-2"
                style={{backgroundColor:buttonColor}}
              >
                Đọc thêm
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-center mt-6">
          <button
            className="text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200"
            onClick={addStory}
          >
            Thêm câu chuyện
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoriesSection;