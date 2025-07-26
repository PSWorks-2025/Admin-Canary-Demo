import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
import SectionWrap from "../SectionWrap";
import "./styles.css";

function EventsOverview({
  pageData,
  setEventOverviews,
  enqueueImageUpload,
  setHasChanges,
  buttonColor,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localHeading, setLocalHeading] = useState(pageData.heading || "");
  const [localTitles, setLocalTitles] = useState(pageData.events.map((event) => event.title || ""));

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (index, field, value) => {
      console.log(`EventsOverview[${index}]: Updating ${field} to ${value}`);
      const debouncedUpdate = debounce((index, field, value) => {
        if (field === "heading") {
          // Heading updates are not stored in Firestore; log for clarity
          console.log("EventsOverview: Heading is UI-only, not saved to Firestore");
        } else {
          setEventOverviews((prev) => ({
            ...prev,
            [pageData.events[index].id]: {
              ...prev[pageData.events[index].id] || {
                title: "",
                abstract: "",
                thumbnail: { src: "", alt: "", caption: "" },
              },
              [field === "description" ? "abstract" : field]: value,
              thumbnail: {
                ...prev[pageData.events[index].id]?.thumbnail || { src: "", alt: "", caption: "" },
                title: field === "title" ? value : prev[pageData.events[index].id]?.title || "",
              },
            },
          }));
          setHasChanges(true);
        }
      }, 500);
      if (field === "heading") {
        setLocalHeading(value);
      } else {
        setLocalTitles((prev) => {
          const newTitles = [...prev];
          newTitles[index] = value;
          return newTitles;
        });
      }
      debouncedUpdate(index, field, value);
    },
    [pageData.events, setEventOverviews, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (id, file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`EventsOverview[${id}]: Enqueuing image for thumbnail.src`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `events/${file.name}`;
        enqueueImageUpload(`main_pages.event_overviews.${id}.thumbnail.src`, storagePath, file);
        setEventOverviews((prev) => ({
          ...prev,
          [id]: {
            ...prev[id] || {
              title: "",
              abstract: "",
              thumbnail: { src: "", alt: "", caption: "" },
            },
            thumbnail: {
              ...prev[id]?.thumbnail || { src: "", alt: "", caption: "" },
              src: blobUrl,
            },
          },
        }));
        setHasChanges(true);
      } else {
        console.error(`EventsOverview[${id}]: Invalid file for thumbnail.src:`, file);
      }
    },
    [enqueueImageUpload, setEventOverviews, setHasChanges]
  );

  const handleAddEvent = useCallback(() => {
    console.log("EventsOverview: Adding new event");
    const newId = `Sự Kiện_${Object.keys(pageData.events).length}_${new Date().toISOString()}`;
    setEventOverviews((prev) => ({
      ...prev,
      [newId]: {
        title: "",
        abstract: "",
        thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
      },
    }));
    setLocalTitles((prev) => [...prev, ""]);
    setHasChanges(true);
  }, [pageData.events, setEventOverviews, setHasChanges]);

  const handleDeleteEvent = useCallback(
    (id, index) => {
      console.log(`EventsOverview[${id}]: Deleting event`);
      setEventOverviews((prev) => {
        const newEvents = Object.keys(prev)
          .filter((key) => key !== id)
          .reduce((acc, key) => ({ ...acc, [key]: prev[key] }), {});
        return newEvents;
      });
      setLocalTitles((prev) => prev.filter((_, i) => i !== index));
      setHasChanges(true);
    },
    [setEventOverviews, setHasChanges]
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
          onClick={handleAddEvent}
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
                handleImageUpload={(e) => handleImageUpload(event.id, e.target.files[0])}
                top="top-2"
                left="left-2"
                section={`event_${event.id}`}
                className="relative bg-cover bg-center h-64 rounded-lg overflow-hidden shadow-md flex p-2 text-white items-end"
                style={{
                  backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url("${event.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")`,
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
                onClick={() => handleDeleteEvent(event.id, index)}
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

EventsOverview.propTypes = {
  pageData: PropTypes.shape({
    heading: PropTypes.string,
    events: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        imageUrl: PropTypes.string,
      })
    ),
  }).isRequired,
  setEventOverviews: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};

export default EventsOverview;