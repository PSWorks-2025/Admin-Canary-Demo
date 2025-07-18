import React, { useContext } from "react";
import { motion } from "framer-motion";
import HeroSection from "../../components/StoriesSection/HeroSection/index.jsx";
import StoriesSection from "../../components/StoriesSection/StoriesSection";
import "./styles.css";
import { ColorContext } from "../../layout";
import useStoryData from "../../hooks/useStoryData";

function Story() {
  const { primaryBackgroundColor, secondaryBackgroundColor, mainData, setMainData } = useContext(ColorContext);
  const {
    storiesData,
    updateHeroField,
    uploadHeroImage,
    updateStoryField,
    uploadStoryImage,
    addStory,
    deleteStory,
    updateMainData,
  } = useStoryData(mainData, setMainData);

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={mainData.hero_sections?.stories?.title || ""}
        heroDescription={mainData.hero_sections?.stories?.description || ""}
        heroImage={mainData.hero_sections?.stories?.image || ""}
        handleFieldChange={updateHeroField}
        handleImageUpload={uploadHeroImage}
        buttonColor={secondaryBackgroundColor}
      />
      <StoriesSection
        pageData={storiesData}
        handleFieldChange={updateHeroField}
        handleStoryFieldChange={updateStoryField}
        handleStoryImageUpload={uploadStoryImage}
        addStory={addStory}
        deleteStory={deleteStory}
        buttonColor={secondaryBackgroundColor}
      />
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 group"
        onClick={() => updateMainData({
          hero_sections: mainData.hero_sections,
          story_overviews: mainData.story_overviews,
        })}
      >
        <span className="hidden group-hover:inline absolute -top-8 right-0 bg-gray-800 text-white text-sm px-2 py-1 rounded">Save Changes</span>
        Save
      </motion.button>
    </div>
  );
}

export default Story;