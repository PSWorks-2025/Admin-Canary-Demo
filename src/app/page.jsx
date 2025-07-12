import { useState, useRef,useContext } from "react";
import HeroSection from "./HomePageSection/HeroSection.jsx";
import StatsSection from "./HomePageSection/StatsSection.jsx";
import EventsSection from "./HomePageSection/EventSection.jsx";
import { ScrollStoryList, ScrollStoryListItem } from "../components/Lists/ScrollStoryList.jsx";
import canary1 from "/images/canary1.jpg";
import canary2 from "/images/canary2.jpg";
import canary3 from "/images/canary3.jpg";
import canary4 from "/images/canary4.jpg";
import canary5 from "/images/canary5.jpg";
import canary6 from "/images/canary6.jpg";
import cover1 from "/images/cover_1.jpg";
import { ColorContext } from "../layout.jsx";
import { TextInput } from "../components/Inputs/TextInput.jsx";
const HomePage = () => {
  const { primaryBackgroundColor, secondaryBackgroundColor, tertiaryBackgroundColor } = useContext(ColorContext);
  const [stats, setStats] = useState({
    stat_0: { title: "Số sự kiện", data: "+99" },
    stat_1: { title: "Số người đã giúp đỡ", data: ">999" },
    stat_2: { title: "Số tiền quyên góp", data: ">1tỷ" },
    stat_3: { title: "Số dự án đã làm", data: "+199" },
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
    story_0: { title: "Tên câu chuyện", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.", imageUrl: canary3 },
    story_1: { title: "Tên câu chuyện", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.", imageUrl: canary4 },
    story_2: { title: "Tên câu chuyện", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.", imageUrl: canary5 },
    story_3: { title: "Tên câu chuyện", description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.", imageUrl: canary6 },
  });

  const [backgroundImage, setBackgroundImage] = useState(cover1);
  const [color, setColor] = useState("#ffffff");
  const [primaryColorStat, setPrimaryColorStat] = useState("#ffffff");
  const [secondaryColorStat, setSecondaryColorStat] = useState("#000000");
  const [firstSection, setFirstSection] = useState("Sự kiện đang diễn ra");
  const [secondSection, setSecondSection] = useState("Các câu chuyện ý nghĩa");

  const handleStoryChange = (key, field, value) => {
    setStories((prevStories) => ({
      ...prevStories,
      [key]: { ...prevStories[key], [field]: value },
    }));
  };

  const handleStoryImageUpload = (key, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStories((prevStories) => ({
          ...prevStories,
          [key]: { ...prevStories[key], imageUrl: e.target.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStory = () => {
    const newKey = `story_${Object.keys(stories).length}`;
    setStories((prevStories) => ({
      ...prevStories,
      [newKey]: { title: "", description: "", href: "#", imageUrl: "" },
    }));
  };

  return (
    <div className="w-full pb-10" style={{ backgroundColor: primaryBackgroundColor}}>
      <HeroSection
        backgroundImage={backgroundImage}
        setBackgroundImage={setBackgroundImage}
        color={color}
        setColor={setColor}
      />
      <StatsSection
        stats={stats}
        setStats={setStats}
        primaryColorStat={primaryColorStat}
        setPrimaryColorStat={setPrimaryColorStat}
        secondaryColorStat={secondaryColorStat}
        setSecondaryColorStat={setSecondaryColorStat}
      />

      <div className="border-b-black border-b-3"></div>

      <EventsSection
        events={events}
        setEvents={setEvents}
        firstSection={firstSection}
        setFirstSection={setFirstSection}
        buttonColor={secondaryBackgroundColor}
      />

      <div className="border-b-black border-b-3"></div>

      <div className="w-full">
        <TextInput
          className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center outline-none"
          value={secondSection}
          onChange={(e) => setSecondSection(e.target.value)}
        />
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
                buttonColor={secondaryBackgroundColor}
              />
            ))}
        </ScrollStoryList>
      </div>
    </div>
  );
};

export default HomePage;