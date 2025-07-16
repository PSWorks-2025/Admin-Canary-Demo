import React, { useRef, useEffect } from "react";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";

const EventsSection = ({
  data,
  setData,
  sectionTitle,
  setSectionTitle,
  enqueueImageUpload,
  buttonColor,
}) => {
  const eventImageRefs = useRef({});

  useEffect(() => {
    Object.keys(data).forEach((key) => {
      if (!eventImageRefs.current[key]) {
        eventImageRefs.current[key] = React.createRef();
      }
    });
    Object.keys(eventImageRefs.current).forEach((key) => {
      if (!data[key]) {
        delete eventImageRefs.current[key];
      }
    });
  }, [data]);

  const handleEventChange = (key, field, value) => {
    setData((prev) => {
      const updated = { ...prev };
      updated[key] = {
        ...updated[key],
        [field === "description" ? "abstract" : field]: value,
        thumbnail: {
          ...updated[key].thumbnail,
          title: field === "title" ? value : updated[key].title,
        },
      };
      return updated;
    });
  };

  const handleEventImageUpload = (key, file) => {
    if (!(file instanceof File)) return;
    const tempUrl = URL.createObjectURL(file);

    setData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        thumbnail: {
          ...prev[key].thumbnail,
          src: tempUrl,
        },
      },
    }));

    enqueueImageUpload({
      section: "events",
      key,
      file,
      path: "events",
    });
  };

  const addEvent = () => {
    const newKey = `Sự Kiện_${Object.keys(data).length}_${new Date().toISOString()}`;
    setData((prev) => ({
      ...prev,
      [newKey]: {
        title: "",
        abstract: "",
        thumbnail: {
          src: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
          alt: "",
          caption: "",
        },
        started_time: new Date(),
      },
    }));
  };

  const deleteEvent = (key) => {
    setData((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  return (
    <div className="w-full">
      <TextInput
        className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center outline-none"
        value={sectionTitle}
        onChange={(e) => setSectionTitle(e.target.value)}
        placeholder="Nhập tiêu đề mục sự kiện"
      />
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={addEvent}
          className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
        >
          Thêm sự kiện
        </button>
      </div>

      <div className="w-full">
        {Object.entries(data)
          .map(([key, event]) => ({
            key,
            title: event.title,
            description: event.abstract,
            imageUrl: event.thumbnail.src,
            started_time: event.started_time,
          }))
          .sort((a, b) => new Date(b.started_time) - new Date(a.started_time))
          .map(({ key, title, description, imageUrl }) => (
            <div key={key} className="w-full h-84 mt-12 flex relative">
              <div className="w-1/2 h-full px-4">
                <div
                  className="w-136 h-full bg-cover bg-center float-right rounded-lg"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                >
                  <ImageInput
                    handleImageUpload={(e) =>
                      handleEventImageUpload(key, e.target.files[0])
                    }
                    section="event"
                    top="top-2"
                    ref={eventImageRefs.current[key]}
                  />
                </div>
              </div>
              <div className="w-1/2 h-full px-4">
                <TextInput
                  className="w-full font-bold text-2xl text-primary-title outline-none"
                  value={title}
                  onChange={(e) => handleEventChange(key, "title", e.target.value)}
                  placeholder="Nhập tiêu đề sự kiện"
                />
                <TextInput
                  type="textarea"
                  className="w-136 text-base/5 py-6 text-primary-paragraph outline-none resize-none"
                  value={description}
                  onChange={(e) =>
                    handleEventChange(key, "description", e.target.value)
                  }
                  placeholder="Nhập mô tả sự kiện"
                  rows="5"
                />
                <br />
                <button
                  className="py-2 px-5 rounded-full cursor-pointer font-semibold text-secondary-title mt-2"
                  style={{ backgroundColor: buttonColor }}
                >
                  Tìm hiểu thêm
                </button>
              </div>
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => deleteEvent(key)}
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
    </div>
  );
};

export default EventsSection;
