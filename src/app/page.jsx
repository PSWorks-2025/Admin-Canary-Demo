import PropTypes from "prop-types";
import { useState, useContext } from "react";
import HeroSection from "./HomePageSection/HeroSection.jsx";
import StatsSection from "./HomePageSection/StatsSection.jsx";
import EventsSection from "./HomePageSection/EventSection.jsx";
import { ScrollStoryList, ScrollStoryListItem } from "../components/Lists/ScrollStoryList.jsx";
import { ColorContext } from "../layout.jsx";
import { TextInput } from "../components/Inputs/TextInput.jsx";
import { db, storage } from "../service/firebaseConfig.jsx";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const HomePage = () => {
  const { primaryBackgroundColor, secondaryBackgroundColor, mainData, setMainData } = useContext(ColorContext);

  const [primaryColorStat, setPrimaryColorStat] = useState(mainData.org_stats.primaryColor || "#ffffff");
  const [secondaryColorStat, setSecondaryColorStat] = useState(mainData.org_stats.secondaryColor || "#000000");

  const updateMainData = async (updates) => {
    setMainData((prevMainData) => {
      const newMainData = { ...prevMainData, ...updates };
      try {
        const docRef = doc(db, "Main pages", "components ");
        updateDoc(docRef, newMainData);
      } catch (error) {
        console.error("Error updating mainData:", error);
      }
      return newMainData;
    });
  };

  const handleStatsChange = async (key, value) => {
    if (!value.trim()) return;
    const numericValue = Number(value.replace(/\D/g, "")) || 0;
    const fieldMap = {
      stat_0: "num_events",
      stat_1: "num_people_helped",
      stat_2: "total_money_donated",
      stat_3: "num_projects",
    };
    updateMainData({
      org_stats: {
        ...mainData.org_stats,
        [fieldMap[key]]: numericValue,
      },
    });
  };

  const handleEventsChange = async (key, field, value) => {
    console.log("handleEventsChange:", { key, field, value }); // Debug
    if (field === "delete") {
      updateMainData({
        event_overviews: {
          ...Object.keys(mainData.event_overviews)
            .filter((k) => k !== key)
            .reduce((acc, k) => ({ ...acc, [k]: mainData.event_overviews[k] }), {}),
        },
      });
    } else if (field === "newEvent") {
      updateMainData({
        event_overviews: {
          ...mainData.event_overviews,
          [key]: {
            title: "",
            abstract: "",
            thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
            started_time: new Date(),
          },
        },
      });
    } else if ((field === "title" || field === "description") && !value.trim()) {
      return;
    } else {
      updateMainData({
        event_overviews: {
          ...mainData.event_overviews,
          [key]: {
            ...mainData.event_overviews[key],
            [field === "description" ? "abstract" : field]: value,
            thumbnail: {
              ...mainData.event_overviews[key].thumbnail,
              title: field === "title" ? value : mainData.event_overviews[key].title,
            },
          },
        },
      });
    }
  }

  const handleEventsImageUpload = async (key, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `events/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          event_overviews: {
            ...mainData.event_overviews,
            [key]: {
              ...mainData.event_overviews[key] || {
                title: "",
                abstract: "",
                thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
                started_time: new Date(),
              },
              thumbnail: {
                ...mainData.event_overviews[key]?.thumbnail || { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading event image for ${key}:`, error);
      }
    } else {
      console.error(`Invalid file for event ${key}:`, file);
    }
  };

  const handleStoryChange = async (key, field, value) => {
    if ((field === "title" || field === "description") && !value.trim()) return;
    updateMainData({
      story_overviews: {
        ...mainData.story_overviews,
        [key]: {
          ...mainData.story_overviews[key],
          [field === "description" ? "abstract" : field]: value,
          thumbnail: {
            ...mainData.story_overviews[key].thumbnail,
            title: field === "title" ? value : mainData.event_overviews[key]?.title || "",
          },
        },
      },
    });
  };

  const handleStoryImageUpload = async (key, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `stories/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          story_overviews: {
            ...mainData.story_overviews,
            [key]: {
              ...mainData.story_overviews[key],
              thumbnail: {
                ...mainData.story_overviews[key].thumbnail,
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading story image for ${key}:`, error);
      }
    } else {
      console.error(`Invalid file for story ${key}:`, file);
    }
  };

  const addStory = async () => {
    const newKey = `Câu Chuyện_${Object.keys(mainData.story_overviews).length}_${new Date().toISOString()}`;
    updateMainData({
      story_overviews: {
        ...mainData.story_overviews,
        [newKey]: {
          title: "",
          abstract: "",
          thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
          posted_time: new Date(),
        },
      },
    });
  };

  const handleBackgroundImageChange = async (file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/home/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          hero_sections: {
            ...mainData.hero_sections,
            home: { ...mainData.hero_sections.home, image: downloadUrl },
          },
        });
      } catch (error) {
        console.error("Error uploading background image:", error);
      }
    } else {
      console.error("Invalid file for background image:", file);
    }
  };

  const handlePrimaryColorStatChange = async (value) => {
    setPrimaryColorStat(value);
    updateMainData({
      org_stats: { ...mainData.org_stats, primaryColor: value },
    });
  };

  const handleSecondaryColorStatChange = async (value) => {
    setSecondaryColorStat(value);
    updateMainData({
      org_stats: { ...mainData.org_stats, secondaryColor: value },
    });
  };

  const handleFirstSectionChange = async (value) => {
    if (!value.trim()) return;
    updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        events: { ...mainData.hero_sections.events, title: value },
      },
    });
  };

  const handleSecondSectionChange = async (value) => {
    if (!value.trim()) return;
    updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        stories: { ...mainData.hero_sections.stories, title: value },
      },
    });
  };

  // Structure stats with fixed titles, only data editable
  const stats = [
    { title: "Số sự kiện", data: String(mainData.org_stats.num_events) },
    { title: "Số người đã giúp đỡ", data: String(mainData.org_stats.num_people_helped) },
    { title: "Số tiền quyên góp", data: String(mainData.org_stats.total_money_donated) },
    { title: "Số dự án đã làm", data: String(mainData.org_stats.num_projects) },
  ];

  return (
    <div className="w-full pb-10" style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        backgroundImage={mainData.hero_sections.home.image}
        setBackgroundImage={handleBackgroundImageChange}
      />
      <StatsSection
        stats={stats}
        setStats={handleStatsChange}
        primaryColorStat={primaryColorStat}
        setPrimaryColorStat={handlePrimaryColorStatChange}
        secondaryColorStat={secondaryColorStat}
        setSecondaryColorStat={handleSecondaryColorStatChange}
      />
      <div className="border-b-black border-b-3"></div>
      <EventsSection
        events={mainData.event_overviews}
        setEvents={handleEventsChange}
        firstSection={mainData.hero_sections.events.title}
        setFirstSection={handleFirstSectionChange}
        buttonColor={secondaryBackgroundColor}
        onImageUpload={handleEventsImageUpload}
      />
      <div className="border-b-black border-b-3"></div>
      <div className="w-full">
        <TextInput
          className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center outline-none"
          value={mainData.hero_sections.stories.title}
          onChange={(e) => handleSecondSectionChange(e.target.value)}
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
          {Object.entries(mainData.story_overviews)
            .map(([key, story]) => ({
              id: key,
              title: story.title,
              description: story.abstract,
              imageUrl: story.thumbnail.src,
              posted_time: story.posted_time,
            }))
            .sort((a, b) => new Date(b.posted_time) - new Date(a.posted_time))
            .map((story) => (
              <ScrollStoryListItem
                key={story.id}
                id={story.id}
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