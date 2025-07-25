import React, { useContext } from "react";
import { motion } from "framer-motion";
import HeroSection from "../../components/StoriesSection/HeroSection";
import StoriesSection from "../../components/StoriesSection/StoriesSection";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import GlobalContext from "../../GlobalContext";

function Story() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    heroSections,
    setHeroSections,
    storyOverviews,
    setStoryOverviews,
    enqueueImageUpload,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    heroSections?.stories?.image || "https://via.placeholder.com/1200x600",
    ...Object.values(storyOverviews || {}).map(
      (story) => story.thumbnail?.src || "https://via.placeholder.com/144x144"
    ),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const updateHeroField = (field, value) => {
    setHeroSections((prev) => ({
      ...prev,
      stories: { ...prev.stories, [field]: value },
    }));
  };

  const updateHeroImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `hero/stories/${file.name}`;
      enqueueImageUpload(`main.hero_sections.stories.${field}`, storagePath, file);
      setHeroSections((prev) => ({
        ...prev,
        stories: { ...prev.stories, [field]: blobUrl },
      }));
    }
  };

  const updateStoryField = (key, field, value) => {
    const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
    const dateValue =
      field === "posted_time" && value && isValidDate(value) ? value : value;
    setStoryOverviews((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field === "description" ? "abstract" : field]: dateValue,
        thumbnail: {
          ...prev[key].thumbnail,
          title: field === "title" ? value : prev[key].title,
        },
      },
    }));
  };

  const updateStoryImage = (key, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `stories/${file.name}`;
      enqueueImageUpload(`main.story_overviews.${key}.thumbnail.src`, storagePath, file);
      setStoryOverviews((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          thumbnail: { ...prev[key].thumbnail, src: blobUrl },
        },
      }));
    }
  };

  const addStory = () => {
    const newKey = `Câu Chuyện_${Object.keys(storyOverviews).length}_${new Date().toISOString()}`;
    setStoryOverviews((prev) => ({
      ...prev,
      [newKey]: {
        title: "",
        abstract: "",
        thumbnail: { src: "", alt: "", caption: "" },
        posted_time: new Date().toISOString(),
      },
    }));
  };

  const deleteStory = (key) => {
    setStoryOverviews((prev) => {
      const newStories = Object.keys(prev)
        .filter((k) => k !== key)
        .reduce((acc, k) => ({ ...acc, [k]: prev[k] }), {});
      return newStories;
    });
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  const storiesData = {
    heading: heroSections?.stories?.title || "Câu chuyện",
    stories: Object.entries(storyOverviews || {}).map(([key, story]) => {
      let formattedDate = "";
      if (story.posted_time) {
        const date = new Date(story.posted_time);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }
      return {
        id: key,
        title: story.title || "",
        description: story.abstract || "",
        imageUrl: story.thumbnail?.src || "https://via.placeholder.com/144x144",
        posted_time: formattedDate,
      };
    }),
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={heroSections?.stories?.title || ""}
        heroDescription={heroSections?.stories?.description || ""}
        heroImage={heroSections?.stories?.image || "https://via.placeholder.com/1200x600"}
        onFieldChange={updateHeroField}
        onImageUpload={updateHeroImage}
        buttonColor={secondaryBackgroundColor}
      />
      <StoriesSection
        pageData={storiesData}
        onFieldChange={updateHeroField}
        onStoryFieldChange={updateStoryField}
        onStoryImageUpload={updateStoryImage}
        onAddStory={addStory}
        onDeleteStory={deleteStory}
        buttonColor={secondaryBackgroundColor}
      />
    </div>
  );
}

export default Story;