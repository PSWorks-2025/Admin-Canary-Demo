import React, { useContext, useState, useEffect } from "react";
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
    handleGlobalSave,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    heroSections?.stories?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ...Object.values(storyOverviews || {}).map(
      (story) => story.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  // Hôm nay em thế nào? Có còn false không? Em hãy cứ luôn true nhé
  const [hasChanges, setHasChanges] = useState(false);


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
        imageUrl: story.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
        posted_time: formattedDate,
      };
    }),
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={heroSections?.stories?.title || ""}
        heroDescription={heroSections?.stories?.description || ""}
        heroImage={heroSections?.stories?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}
        setHeroSections={setHeroSections}
        enqueueImageUpload={enqueueImageUpload}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
      />
      <StoriesSection
        pageData={storiesData}
        setHeroSections={setHeroSections}
        setStoryOverviews={setStoryOverviews}
        enqueueImageUpload={enqueueImageUpload}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
      />
    </div>
  );
}

export default Story;