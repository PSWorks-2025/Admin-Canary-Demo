import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import useImagePreloader from "../hooks/useImagePreloader";

import SupportButton from "../components/SupportButton";
import StorySection from "../components/StorySection";
import LoadingScreen from "../components/screens/LoadingScreen";

const EachStoryPage = ({ storyName, sections }) => {
  const imageUrls = sections
    .map((section) => section.image?.src)
    .filter(Boolean);
  const imagesLoaded = useImagePreloader(imageUrls);

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex flex-col items-center p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">{storyName}</h1>

      {sections.map((section, index) => (
        <StorySection key={index} section={section} />
      ))}
      <SupportButton onClick={() => console.log("support clicked")} />
    </div>
  );
};

EachStoryPage.propTypes = {
  storyName: PropTypes.string.isRequired,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.shape({
        src: PropTypes.string,
      }),
    }),
  ).isRequired,
};

export default EachStoryPage;
