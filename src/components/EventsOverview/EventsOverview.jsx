import React, { useState } from "react";
import "./styles.css";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function EventsOverview({ pageData, handleFieldChange, handleImageUpload, imageInputRefs,buttonColor }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localHeading, setLocalHeading] = useState(pageData.heading);
  const [localTitles, setLocalTitles] = useState(pageData.events.map(event => event.title));

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleFieldChange = debounce(handleFieldChange, 500);

  const handleChange = (index, field, value) => {
    if (field === "heading") {
      setLocalHeading(value);
      debouncedHandleFieldChange(field, value);
    } else {
      setLocalTitles(prev => {
        const newTitles = [...prev];
        newTitles[index] = value;
        return newTitles;
      });
      debouncedHandleFieldChange(index, field, value);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % pageData.events.length);
  };

  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + pageData.events.length) % pageData.events.length
    );
  };

  const displayedEvents = pageData.events
    .slice(currentIndex, currentIndex + 4)
    .concat(pageData.events.slice(0, Math.max(0, currentIndex + 4 - pageData.events.length)));

  return (
    <section style={{borderTopColor:buttonColor,borderTopWidth:2}} className="px-8 py-8">
      <TextInput
        className="w-full text-2xl font-bold text-black outline-none bg-transparent text-center mb-4"
        value={localHeading}
        onChange={(e) => handleChange("heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="flex items-center justify-between w-2/3 mx-auto mb-10">
        <button
          className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-200"
          onClick={prevImage}
        >
          Previous
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 h-64 overflow-hidden w-full">
          {displayedEvents.map((event, index) => (
            
           
              <ImageInput
                handleImageUpload={(file) => handleImageUpload(index, file.target.files[0])}
                top="top-2"
                left="left-2"
                section={`event_${index}`}
              className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden shadow-md flex p-2 text-white items-end"
 style={{
                backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${
                  event.imageUrl || "https://via.placeholder.com/300x256"
                })`
              }}
              >
                   <TextInput
                className="w-full text-base font-medium text-white outline-none bg-transparent"
                value={localTitles[index] || ""}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề sự kiện"
              />
              </ImageInput>
          ))}
        </div>
        <button
          className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-200"
          onClick={nextImage}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default EventsOverview;