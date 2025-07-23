import React, { useState, useCallback } from "react";
import "./styles.css";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
import SectionWrap from "../SectionWrap";

function EventsOverview({ pageData, onFieldChange, onImageUpload, addEvent, deleteEvent, buttonColor }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localHeading, setLocalHeading] = useState(pageData.heading);
  const [localTitles, setLocalTitles] = useState(pageData.events.map((event) => event.title));

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (index, field, value) => {
      const debouncedHandleFieldChange = debounce(onFieldChange, 500);
      if (field === "heading") {
        setLocalHeading(value);
        debouncedHandleFieldChange(field, value);
      } else if (field === "delete") {
        deleteEvent(pageData.events[index].id);
      } else {
        setLocalTitles((prev) => {
          const newTitles = [...prev];
          newTitles[index] = value;
          return newTitles;
        });
        debouncedHandleFieldChange(pageData.events[index].id, field, value);
      }
    },
    [onFieldChange, pageData.events, deleteEvent]
  );

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pageData.events.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + pageData.events.length) % pageData.events.length);
  };

  const displayedEvents = pageData.events
    .slice(currentIndex, currentIndex + 4)
    .concat(pageData.events.slice(0, Math.max(0, currentIndex + 4 - pageData.events.length)));

  return (
    <SectionWrap className="w-full" borderColor={buttonColor}>
      <TextInput
        className="w-full text-2xl font-bold text-black outline-none bg-transparent text-center mb-4"
        value={localHeading}
        onChange={(e) => handleChange(0, "heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={addEvent}
          className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
        >
          Thêm sự kiện
        </button>
      </div>
      <div className="flex items-center justify-between w-2/3 mx-auto mb-10">
        <button
          className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-200"
          onClick={prevImage}
        >
          Previous
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 h-64 overflow-hidden w-full">
          {displayedEvents.map((event, index) => (
            <div key={`event_${event.id}`} className="relative">
              <ImageInput
                handleImageUpload={(file) => onImageUpload(event.id, file)}
                top="top-2"
                left="left-2"
                section={`event_${event.id}`}
                className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden shadow-md flex p-2 text-white items-end"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url("${event.imageUrl}")`,
                }}
              >
                <TextInput
                  className="w-full text-base font-medium text-white outline-none bg-transparent"
                  value={localTitles[index] || ""}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  placeholder="Nhập tiêu đề sự kiện"
                />
              </ImageInput>
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => handleChange(index, "delete", null)}
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
          ))}
        </div>
        <button
          className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-200"
          onClick={nextImage}
        >
          Next
        </button>
      </div>
    </SectionWrap>
  );
}

export default EventsOverview;