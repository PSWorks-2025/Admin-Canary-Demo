import React, { useState } from "react";
import "./styles.css";

function EventsOverview({ pageData, handleFieldChange, handleImageUpload, imageInputRefs }) {
  const [currentIndex, setCurrentIndex] = useState(0);

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
    <section className="px-8 py-8">
      <input
        className="w-full text-2xl font-bold text-black outline-none bg-transparent text-center mb-4"
        value={pageData.heading}
        onChange={(e) => handleFieldChange("heading", e.target.value)}
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
            <div
              key={index}
              className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden shadow-md flex p-2 text-white items-end"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${
                  event.imageUrl || "https://via.placeholder.com/300x256"
                })`,
              }}
            >
              <input
                className="w-full text-base font-medium text-white outline-none bg-transparent"
                value={event.title}
                onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                placeholder="Nhập tiêu đề sự kiện"
              />
              <button
                className="absolute top-2 left-2 p-2 bg-blue-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => imageInputRefs[index].current.click()}
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
                ref={imageInputRefs[index]}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(index, e.target.files[0])}
              />
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
    </section>
  );
}

export default EventsOverview;  