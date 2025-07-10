import { useState, useRef } from "react";
import wave from "/images/wave.svg";
import canary1 from "/images/canary1.jpg";
import canary2 from "/images/canary2.jpg";
import canary3 from "/images/canary3.jpg";
import canary4 from "/images/canary4.jpg";
import canary5 from "/images/canary5.jpg";
import canary6 from "/images/canary6.jpg";
import cover1 from "/images/cover_1.jpg";

import {
  ScrollStoryList,
  ScrollStoryListItem,
} from "../components/Lists/ScrollStoryList.jsx";

const HomePage = () => {
  const [stats, setStats] = useState({
    stat_0: {
      title: "Số sự kiện",
      data: "+99",
    },
    stat_1: {
      title: "Số người đã giúp đỡ",
      data: ">999",
    },
    stat_2: {
      title: "Số tiền quyên góp",
      data: ">1tỷ",
    },
    stat_3: {
      title: "Số dự án đã làm",
      data: "+199",
    },
  });

  const [events, setEvents] = useState({
    event_0: {
      title: "Tên sự kiện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam. Corporis laboriosam architecto necessitatibus officiis consequatur obcaecati, reprehenderit animi perspiciatis cupiditate.",
      imageUrl: canary1,
    },
    event_1: {
      title: "Tên sự kiện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam. Corporis laboriosam architecto necessitatibus officiis consequatur obcaecati, reprehenderit animi perspiciatis cupiditate.",
      imageUrl: canary2,
    },
    event_2: {
      title: "Tên sự kiện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam. Corporis laboriosam architecto necessitatibus officiis consequatur obcaecati, reprehenderit animi perspiciatis cupiditate.",
      imageUrl: canary2,
    },
  });

  const [stories, setStories] = useState({
    story_0: {
      title: "Tên câu chuyện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
      imageUrl: canary3,
    },
    story_1: {
      title: "Tên câu chuyện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
      imageUrl: canary4,
    },
    story_2: {
      title: "Tên câu chuyện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
      imageUrl: canary5,
    },
    story_3: {
      title: "Tên câu chuyện",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
      imageUrl: canary6,
    },
  });

  const [backgroundImage, setBackgroundImage] = useState(cover1);
  const [color, setColor] = useState("#ffffff");
  const [primaryColorStat, setPrimaryColorStat] = useState("#ffffff");
  const [secondaryColorStat, setSecondaryColorStat] = useState("#000000");
  const [firstSection, setFirstSection] = useState("Sự kiện đang diễn ra");
  const [secondSection, setSecondSection] = useState("Các câu chuyện ý nghĩa");
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleEventChange = (key, field, value) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [key]: {
        ...prevEvents[key],
        [field]: value,
      },
    }));
  };

  const handleEventImageUpload = (key, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEvents((prevEvents) => ({
          ...prevEvents,
          [key]: {
            ...prevEvents[key],
            imageUrl: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addEvent = () => {
    const newKey = `event_${Object.keys(events).length}`;
    setEvents((prevEvents) => ({
      ...prevEvents,
      [newKey]: {
        title: "",
        description: "",
        imageUrl: "",
      },
    }));
  };

  const handleStoryChange = (key, field, value) => {
    setStories((prevStories) => ({
      ...prevStories,
      [key]: {
        ...prevStories[key],
        [field]: value,
      },
    }));
  };

  const handleStoryImageUpload = (key, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStories((prevStories) => ({
          ...prevStories,
          [key]: {
            ...prevStories[key],
            imageUrl: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStory = () => {
    const newKey = `story_${Object.keys(stories).length}`;
    setStories((prevStories) => ({
      ...prevStories,
      [newKey]: {
        title: "",
        description: "",
        href: "#",
        imageUrl: "",
      },
    }));
  };

  return (
    <div className="w-full pb-10" style={{ backgroundColor: color }}>
      <div
        className="w-full h-178 bg-cover bg-center relative"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
          height: "calc(100vh - 5rem)",
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          onClick={triggerFileInput}
          className="absolute top-4 right-4 py-2 px-4 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title z-10"
        >
          Upload Image
        </button>

        <input
          type="color"
          id="colorPicker"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>

      <div className="w-full h-full md:h-64 flex flex-col md:flex-row ground justify-center items-center z-auto relative -mt-30">
        {Object.entries(stats)
          .map(([key, stat]) => [key.slice(5), stat])
          .sort((a, b) => a[0] - b[0])
          .map(([key, stat]) => (
            <div
              key={`stat_${key}`}
              className="w-64 h-full mx-4 relative overflow-hidden rounded-xl"
              style={{
                backgroundColor: primaryColorStat,
                borderRadius: "1.5rem",
                boxShadow: "0px 8px 28px -9px rgba(0,0,0,0.45)",
              }}
            >
              <div
                className="wave absolute w-[540px] h-[700px] opacity-60"
                style={{
                  left: "0",
                  top: "270px",
                  marginLeft: "-50%",
                  marginTop: "-70%",
                  background: `linear-gradient(744deg, ${secondaryColorStat}, #5b42f3 50%, #00ddeb)`,
                  borderRadius: "40%",
                  animation: "wave 10s infinite linear",
                }}
              />
              <div className="relative z-10 w-full flex flex-col items-center justify-center">
                <input
                  className="w-full font-medium text-sm md:text-xl py-3 md:py-9 text-center outline-none text-white"
                  value={stat.title}
                />
                <input
                  className="w-full font-bold text-2xl md:text-6xl text-white text-center outline-none"
                  value={stat.data}
                />
              </div>
            </div>
          ))}
      </div>
      <style>
        {`
          @keyframes wave {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}
      </style>

      <div className="w-full h-20 flex justify-center items-center gap-4">
        <input
          type="color"
          value={primaryColorStat}
          onChange={(e) => setPrimaryColorStat(e.target.value)}
        />
        <input
          type="color"
          value={secondaryColorStat}
          onChange={(e) => setSecondaryColorStat(e.target.value)}
        />
      </div>

      {/* Events section */}
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
              const fileInputRef = useRef(null);

              return (
                <div key={eventKey} className="w-full h-84 mt-12 flex">
                  <div className="w-1/2 h-full px-4 relative">
                    <div
                      className="w-136 h-full bg-cover bg-center float-right rounded-lg"
                      style={{ backgroundImage: `url("${event.imageUrl}")` }}

                    >
                    <button
                      className="absolute top-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
                      onClick={() => fileInputRef.current.click()}
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
                          stroke-width="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
                        />
                      </svg>
                    </button>
                    </div>
             
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleEventImageUpload(eventKey, e.target.files[0])}
                    />
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
                    ></textarea>
                    <br></br>
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

      {/* Stories section */}
      <div className="w-full">
        <input className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center outline-none" value={secondSection} onChange={e=>setSecondSection(e.target.value)} />
        <div className="w-full flex justify-center mb-8">
          <button
            onClick={addStory}
            className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
          >
            Thêm câu chuyện
          </button>
        </div>
        <ScrollStoryList>
          {Object.entries(stories)
            .map(([key, story]) => [key.slice(6), story])
            .sort((a, b) => a[0] - b[0])
            .map(([key, story]) => (
              <ScrollStoryListItem
                key={`story_${key}`}
                id={`story_${key}`}
                imageUrl={story.imageUrl}
                title={story.title}
                description={story.description}
                onChange={handleStoryChange}
                onImageUpload={handleStoryImageUpload}
              />
            ))}
        </ScrollStoryList>
      </div>
    </div>
  );
};

export default HomePage;