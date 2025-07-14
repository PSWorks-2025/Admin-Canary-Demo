import React, { useContext } from "react";
import HeroSection from "./StoriesSection/HeroSection";
import StoriesSection from "./StoriesSection/StoriesSection";
import "./styles.css";
import { ColorContext } from "../../layout";
import { db, storage } from "../../service/firebaseConfig.jsx";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Story() {
  const { primaryBackgroundColor, secondaryBackgroundColor, mainData, setMainData } = useContext(ColorContext);

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

  const handleFieldChange = async (field, value) => {
    if (!value.trim()) return;
    updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        stories: { ...mainData.hero_sections.stories, [field]: value },
      },
    });
  };

  const handleImageUpload = async (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/stories/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          hero_sections: {
            ...mainData.hero_sections,
            stories: { ...mainData.hero_sections.stories, [field]: downloadUrl },
          },
        });
      } catch (error) {
        console.error(`Error uploading hero image for ${field}:`, error);
      }
    } else {
      console.error(`Invalid file for hero image ${field}:`, file);
    }
  };

  const handleStoryFieldChange = async (key, field, value) => {
    if (!value.trim()) return;
    updateMainData({
      story_overviews: {
        ...mainData.story_overviews,
        [key]: {
          ...mainData.story_overviews[key],
          [field === "description" ? "abstract" : "title"]: value,
          thumbnail: {
            ...mainData.story_overviews[key].thumbnail,
            title: field === "title" ? value : mainData.story_overviews[key].title,
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
      console.error(`Invalid file for story image ${key}:`, file);
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
          thumbnail: { src: "", alt: "", caption: "" },
          posted_time: new Date(),
        },
      },
    });
  };

  const deleteStory = async (key) => {
    console.log(`Deleting story with key ${key}`);
    updateMainData({
      story_overviews: {
        ...Object.keys(mainData.story_overviews)
          .filter((k) => k !== key)
          .reduce((acc, k) => ({ ...acc, [k]: mainData.story_overviews[k] }), {}),
      },
    });
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={mainData.hero_sections.stories.title}
        heroDescription={mainData.hero_sections.stories.description}
        heroImage={mainData.hero_sections.stories.image}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
        buttonColor={secondaryBackgroundColor}
      />
      <div className="border-b-black border-b-3"></div>
      <StoriesSection
        heading={mainData.hero_sections.stories.title}
        stories={Object.entries(mainData.story_overviews).map(([key, story]) => ({
          id: key,
          title: story.title,
          description: story.abstract,
          imageUrl: story.thumbnail.src,
          posted_time: story.posted_time,
        }))}
        handleFieldChange={handleFieldChange}
        handleStoryFieldChange={handleStoryFieldChange}
        handleStoryImageUpload={handleStoryImageUpload}
        addStory={addStory}
        deleteStory={deleteStory}
        buttonColor={secondaryBackgroundColor}
      />
    </div>
  );
}

export default Story;