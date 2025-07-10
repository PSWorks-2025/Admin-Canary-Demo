import React from "react";

const StoriesSection = ({
  heading,
  stories,
  handleFieldChange,
  handleStoryFieldChange,
  handleStoryImageUpload,
  addStory,
  deleteStory,
  storyImageRefs,
}) => {
  return (
    <div className="px-4">
      <input
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
              <button
                className="absolute top-2 left-2 p-2 bg-[#e6ebf5] text-white rounded-full cursor-pointer z-10"
                onClick={() => storyImageRefs[index].current.click()}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref={storyImageRefs[index]}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleStoryImageUpload(index, e.target.files[0])}
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
              <input
                className="text-lg font-semibold text-black outline-none bg-transparent w-full text-center"
                value={story.title}
                onChange={(e) => handleStoryFieldChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề câu chuyện"
              />
              <textarea
                className="text-sm px-3 text-black outline-none bg-transparent resize-none w-full"
                value={story.description}
                onChange={(e) => handleStoryFieldChange(index, "description", e.target.value)}
                placeholder="Nhập mô tả câu chuyện"
                rows="4"
              />
              <button
                className="text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200 mt-2"
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
              <button
                className="absolute top-2 left-2 p-2 bg-[#e6ebf5] text-white rounded-full cursor-pointer z-10"
                onClick={() => storyImageRefs[index].current.click()}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref={storyImageRefs[index]}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleStoryImageUpload(index, e.target.files[0])}
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
              <input
                className="text-lg font-semibold text-black outline-none bg-transparent w-full"
                value={story.title}
                onChange={(e) => handleStoryFieldChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề câu chuyện"
              />
              <textarea
                className="text-base text-black outline-none bg-transparent resize-none w-full"
                value={story.description}
                onChange={(e) => handleStoryFieldChange(index, "description", e.target.value)}
                placeholder="Nhập mô tả câu chuyện"
                rows="4"
              />
              <button
                className="text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200 mt-2"
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