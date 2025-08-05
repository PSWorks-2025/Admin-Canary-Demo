import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import HeroSection from "../../components/StoriesSection/HeroSection";
import StoriesSection from "../../components/StoriesSection/StoriesSection";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import GlobalContext from "../../GlobalContext";
import SaveFloatingButton from "../../globalComponent/SaveButton/index.jsx";

function Story() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    heroSections,
    setHeroSections,
    storyOverviews,
    setStoryOverviews,
    sectionTitles,
    setSectionTitles,
    enqueueImageUpload,
    enqueueImageDelete,
    handleGlobalSave,
    isSaving,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    heroSections?.stories?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ...Object.values(storyOverviews || {}).map(
      story => story.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    )
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const [hasChanges, setHasChanges] = useState(false);

  const saveUpdates = async () => {
    if (isSaving) return;
    try {
      await handleGlobalSave();
      setHasChanges(false);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  const storiesData = {
    heading: sectionTitles.stories || "Câu chuyện",
    stories: Object.entries(storyOverviews || {}).map(([key, story]) => {
      let formattedDate = "";
      if (story.posted_time) {
        const date = story.posted_time.toDate
          ? story.posted_time.toDate()
          : new Date(story.posted_time);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }
      return {
        id: key,
        title: story.title || "",
        description: story.abstract || "",
        imageUrl: story.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
        posted_time: formattedDate
      };
    })
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        title={heroSections?.stories?.title || ""}
        description={heroSections?.stories?.description || ""}
        heroImage={heroSections?.stories?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}
        setHeroSections={setHeroSections}
        enqueueImageUpload={enqueueImageUpload}
        enqueueImageDelete={enqueueImageDelete}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
      />
      <StoriesSection
        pageData={storiesData}
        setStoryOverviews={setStoryOverviews}
        enqueueImageUpload={enqueueImageUpload}
        enqueueImageDelete={enqueueImageDelete}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
        sectionTitles={sectionTitles}
        setSectionTitles={setSectionTitles}
      />
      <SaveFloatingButton visible={hasChanges} onSave={saveUpdates} disabled={isSaving} />
    </div>
  );
}

export default Story;