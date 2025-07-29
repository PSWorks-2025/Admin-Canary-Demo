import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";
import SectionWrap from "../../SectionWrap";

const StoriesSection = ({
  pageData,
  setHeroSections,
  setStoryOverviews,
  enqueueImageUpload,
  setHasChanges,
  buttonColor,
}) => {
  const [localHeading, setLocalHeading] = useState(pageData.heading || "");
  const [localStories, setLocalStories] = useState(pageData.stories || []);

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
      console.log(`StoriesSection[${id}]: Updating ${field} to ${value}`);
      if (field === "heading") {
        const debouncedUpdate = debounce((field, value) => {
          setHeroSections((prev) => ({
            ...prev,
            stories: { ...prev.stories, title: value },
          }));
          setHasChanges(true);
        }, 500);
        setLocalHeading(value);
        debouncedUpdate(field, value);
      } else {
        const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
        const dateValue = field === "posted_time" && value && isValidDate(value) ? value : value;
        const debouncedUpdate = debounce((id, field, value) => {
          setStoryOverviews((prev) => ({
            ...prev,
            [id]: {
              ...prev[id],
              [field === "description" ? "abstract" : field]: dateValue,
              thumbnail: {
                ...prev[id].thumbnail,
                title: field === "title" ? value : prev[id].title,
              },
            },
          }));
          setHasChanges(true);
        }, 500);
        setLocalStories((prev) => {
          const newStories = [...prev];
          newStories[index] = { ...newStories[index], [field]: value };
          return newStories;
        });
        debouncedUpdate(id, field, value);
      }
    },
    [setHeroSections, setStoryOverviews, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (id, file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`StoriesSection[${id}]: Enqueuing image for thumbnail.src`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `stories/${file.name}`;
        enqueueImageUpload(`main_pages.story_overviews.${id}.thumbnail.src`, storagePath, file);
        setStoryOverviews((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            thumbnail: { ...prev[id].thumbnail, src: blobUrl },
          },
        }));
        setLocalStories((prev) =>
          prev.map((story) =>
            story.id === id ? { ...story, imageUrl: blobUrl } : story
          )
        );
        setHasChanges(true);
      } else {
        console.error(`StoriesSection[${id}]: Invalid file for thumbnail.src:`, file);
      }
    },
    [enqueueImageUpload, setStoryOverviews, setHasChanges]
  );

  const handleAddStory = useCallback(() => {
    console.log("StoriesSection: Adding new story");
    const newKey = `story_${new Date().toISOString()}`;
    setStoryOverviews((prev) => ({
      ...prev,
      [newKey]: {
        title: "",
        abstract: "",
        thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
        posted_time: new Date().toISOString(),
      },
    }));
    setLocalStories((prev) => [
      ...prev,
      {
        id: newKey,
        title: "",
        description: "",
        imageUrl: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
        posted_time: new Date().toISOString().split("T")[0],
      },
    ]);
    setHasChanges(true);
  }, [pageData.stories, setStoryOverviews, setHasChanges]);

  const handleDeleteStory = useCallback(
    (id) => {
      console.log(`StoriesSection[${id}]: Deleting story`);
      setStoryOverviews((prev) => {
        const newStories = Object.keys(prev)
          .filter((k) => k !== id)
          .reduce((acc, k) => ({ ...acc, [k]: prev[k] }), {});
        return newStories;
      });
      setLocalStories((prev) => prev.filter((story) => story.id !== id));
      setHasChanges(true);
    },
    [setStoryOverviews, setHasChanges]
  );

  return (
    <SectionWrap className="w-full" borderColor={buttonColor}>
      <TextInput
        className="mt-5 w-full text-center font-bold text-4xl ml-5 sm:ml-0 mx-auto outline-none bg-transparent"
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
                handleImageUpload={(e) => handleImageUpload(story.id, e.target.files[0])}
                section={`story-${story.id}`}
                top="top-2"
                left="left-2"
                className="w-full h-full object-cover bg-no-repeat bg-center"
                style={{ backgroundImage: `url("${story.imageUrl || 'https://via.placeholder.com/144x144'}")` }}
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => handleDeleteStory(story.id)}
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
            onClick={handleAddStory}
          >
            Thêm câu chuyện
          </button>
        </div>
      </div>

      {/* Desktop Display */}
      <div className="hidden sm:block">
        {pageData.stories.map((story, index) => (
          <div key={story.id} className="flex flex-row justify-center items-start mt-10">
            <div className="image-container w-full max-w-[40%] h-[400px] overflow-hidden rounded-lg mr-4 relative">
              <ImageInput
                handleImageUpload={(e) => handleImageUpload(story.id, e.target.files[0])}
                section={`story-${story.id}`}
                top="top-2"
                left="left-2"
                style={{ backgroundImage: `url("${story.imageUrl || 'https://via.placeholder.com/144x144'}")` }}
                className="w-full h-full object-cover bg-center bg-no-repeat"
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => handleDeleteStory(story.id)}
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
            onClick={handleAddStory}
          >
            Thêm câu chuyện
          </button>
        </div>
      </div>
    </SectionWrap>
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
  setHeroSections: PropTypes.func.isRequired,
  setStoryOverviews: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};

export default StoriesSection;