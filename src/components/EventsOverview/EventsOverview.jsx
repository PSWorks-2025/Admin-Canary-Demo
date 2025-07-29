import React, { useState, useCallback } from "react";
import { Link } from "react-router";
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
          console.log("EventsOverview: Heading is UI-only, not saved to Firestore");
        } else {
          const eventId = pageData.events[index]?.id;
          if (eventId) {
            setEventOverviews((prev) => ({
              ...prev,
              [eventId]: {
                ...prev[eventId] || {
                  title: "",
                  abstract: "",
                  thumbnail: { src: "", alt: "", caption: "" },
                },
                [field === "description" ? "abstract" : field]: value,
                thumbnail: {
                  ...prev[eventId]?.thumbnail || { src: "", alt: "", caption: "" },
                  title: field === "title" ? value : prev[eventId]?.title || "",
                },
              },
            }));
            setHasChanges(true);
          }
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
    const newId = `event_${Date.now()}`;
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
  }, [setEventOverviews, setHasChanges]);

  const handleDeleteEvent = useCallback(
    (id, index) => {
      console.log(`EventsOverview[${id}]: Deleting event`);
      setEventOverviews((prev) => {
        const newEvents = { ...prev };
        delete newEvents[id];
        return newEvents;
      });
      setLocalTitles((prev) => prev.filter((_, i) => i !== index));
      setCurrentIndex((prev) => Math.max(0, Math.min(prev, pageData.events.length - 2)));
      setHasChanges(true);
    },
    [setEventOverviews, setHasChanges]
  );

  const nextImage = useCallback(() => {
    if (pageData.events.length > 4) {
      setCurrentIndex((prev) => (prev + 1) % pageData.events.length);
      console.log("EventsOverview: Next image, currentIndex:", (currentIndex + 1) % pageData.events.length);
    }
  }, [pageData.events.length, currentIndex]);

  const prevImage = useCallback(() => {
    if (pageData.events.length > 4) {
      setCurrentIndex((prev) => (prev - 1 + pageData.events.length) % pageData.events.length);
      console.log("EventsOverview: Prev image, currentIndex:", (currentIndex - 1 + pageData.events.length) % pageData.events.length);
    }
  }, [pageData.events.length, currentIndex]);

  const displayedEvents = pageData.events.length > 0
    ? pageData.events
        .slice(currentIndex, currentIndex + 4)
        .concat(pageData.events.slice(0, Math.max(0, currentIndex + 4 - pageData.events.length)))
    : [];

  return (
    <SectionWrap className="w-full" borderColor={buttonColor}>
      <TextInput
        className="w-full text-xl sm:text-2xl font-bold text-black outline-none bg-transparent text-center mb-4"
        value={localHeading}
        onChange={(e) => handleChange(0, "heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="w-full flex justify-center mb-6 sm:mb-8">
        <button
          onClick={handleAddEvent}
          className="py-1.5 sm:py-2 px-4 sm:px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title text-sm sm:text-base"
        >
          Thêm sự kiện
        </button>
      </div>
      {pageData.events.length === 0 ? (
        <div className="w-full text-center text-primary-paragraph">
          Không có sự kiện nào để hiển thị
        </div>
      ) : (
        <div className="flex items-center justify-between w-full sm:w-2/3 mx-auto mb-8 sm:mb-10">
          <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base ${pageData.events.length <= 4 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={prevImage}
            disabled={pageData.events.length <= 4}
          >
            Previous
          </button>
          <div className="grid grid-cols-1 xxs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5 h-48 sm:h-64 overflow-hidden w-full">
            {displayedEvents.map((event, index) => (
              <Link
                key={`event_${event.id}`}
                to="/edit-content"
                state={{
                  id: event.id,
                  title: localTitles[index + currentIndex] || event.title || "",
                  thumbnail: event.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
                }}
                className="relative block"
              >
                <ImageInput
                  handleImageUpload={(e) => handleImageUpload(event.id, e.target.files[0])}
                  top="top-2"
                  left="left-2"
                  section={`event_${event.id}`}
                  className="relative bg-cover bg-center h-48 sm:h-64 rounded-lg overflow-hidden shadow-md flex p-2 text-white items-end"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url("${event.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")`,
                  }}
                >
                  <TextInput
                    className="w-full text-sm sm:text-base font-medium text-white outline-none bg-transparent"
                    value={localTitles[index + currentIndex] || ""}
                    onChange={(e) => handleChange(index + currentIndex, "title", e.target.value)}
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                </ImageInput>
                <button
                  className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteEvent(event.id, index + currentIndex);
                  }}
                >
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5"
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
              </Link>
            ))}
          </div>
          <button
            className={`px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors duration-200 text-sm sm:text-base ${pageData.events.length <= 4 ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={nextImage}
            disabled={pageData.events.length <= 4}
          >
            Next
          </button>
        </div>
      )}
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