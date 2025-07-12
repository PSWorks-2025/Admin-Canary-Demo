import React,{ useRef } from "react";
import { ImageInput } from "../../components/Inputs/ImageInput";
const EventsSection = ({ events, setEvents, firstSection, setFirstSection }) => {
  const eventImageRefs = useRef(
    Object.keys(events).reduce((acc, key) => {
      acc[key] = React.createRef();
      return acc;
    }, {})
  ).current;

  const handleEventChange = (key, field, value) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [key]: { ...prevEvents[key], [field]: value },
    }));
  };

  const handleEventImageUpload = (key, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEvents((prevEvents) => ({
          ...prevEvents,
          [key]: { ...prevEvents[key], imageUrl: e.target.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addEvent = () => {
    const newKey = `event_${Object.keys(events).length}`;
    setEvents((prevEvents) => ({
      ...prevEvents,
      [newKey]: { title: "", description: "", imageUrl: "" },
    }));
    eventImageRefs[newKey] = React.createRef();
  };

  return (
    <div className="w-full">
      <input
        className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center outline-none"
        value={firstSection}
        onChange={(e) => setFirstSection(e.target.value)}
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
        {Object.entries(events)
          .map(([key, event]) => [key.slice(6), event])
          .sort((a, b) => a[0] - b[0])
          .map(([key, event]) => {
            const eventKey = `event_${key}`;
            return (
              <div key={eventKey} className="w-full h-84 mt-12 flex">
                <div className="w-1/2 h-full px-4 relative">
                  <div
                    className="w-136 h-full bg-cover bg-center float-right rounded-lg"
                    style={{ backgroundImage: `url("${event.imageUrl}")` }}
                  >
                    <ImageInput
                      ref={eventImageRefs[eventKey]}
                      handleImageUpload={(e) => handleEventImageUpload(eventKey, e.target.files[0])}
                      // triggerFileInput={eventImageRefs[eventKey].current}
                      section="event"
                      top="top-2"
                    />
                  </div>
                </div>
                <div className="w-1/2 h-full px-4">
                  <input
                    className="w-full font-bold text-2xl text-primary-title outline-none"
                    value={event.title}
                    onChange={(e) => handleEventChange(eventKey, "title", e.target.value)}
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                  <textarea
                    className="w-136 text-base/5 py-6 text-primary-paragraph outline-none resize-none"
                    value={event.description}
                    onChange={(e) => handleEventChange(eventKey, "description", e.target.value)}
                    placeholder="Nhập mô tả sự kiện"
                    rows="5"
                  />
                  <br />
                  <button
                    className="py-2 px-5 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title mt-2"
                  >
                    Tìm hiểu thêm
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default EventsSection;