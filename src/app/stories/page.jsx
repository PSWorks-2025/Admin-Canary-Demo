import React, { useState, useRef } from "react";
import HeroSection from "./StoriesSection/HeroSection";
import StoriesSection from "./StoriesSection/StoriesSection";
import "./styles.css";

function Story() {
  const [pageData, setPageData] = useState({
    heroTitle: "Tên câu chuyện",
    heroDescription:
      "Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget aliquet gravida ac nisl vitae quis.",
    heroImage: "",
    heading: "Câu chuyện ý nghĩa",
    stories: [
      {
        title: "Tên câu chuyện",
        description:
          "Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget aliquet gravida ac nisl vitae quis.",
        imageUrl: "",
      },
    ],
  });

  const heroImageRef = useRef(null);
  const storyImageRefs = useRef(pageData.stories.map(() => React.createRef())).current;

  const handleFieldChange = (field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleStoryFieldChange = (index, field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      stories: prevData.stories.map((story, i) =>
        i === index ? { ...story, [field]: value } : story
      ),
    }));
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          [field]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          stories: prevData.stories.map((story, i) =>
            i === index ? { ...story, imageUrl: e.target.result } : story
          ),
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStory = () => {
    setPageData((prevData) => ({
      ...prevData,
      stories: [
        ...prevData.stories,
        { title: "", description: "", imageUrl: "" },
      ],
    }));
    storyImageRefs.push(React.createRef());
  };

  const deleteStory = (index) => {
    setPageData((prevData) => ({
      ...prevData,
      stories: prevData.stories.filter((_, i) => i !== index),
    }));
    storyImageRefs.splice(index, 1);
  };

  return (
    <>
      <HeroSection
        heroTitle={pageData.heroTitle}
        heroDescription={pageData.heroDescription}
        heroImage={pageData.heroImage}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
        heroImageRef={heroImageRef}
      />
      <StoriesSection
        heading={pageData.heading}
        stories={pageData.stories}
        handleFieldChange={handleFieldChange}
        handleStoryFieldChange={handleStoryFieldChange}
        handleStoryImageUpload={handleStoryImageUpload}
        addStory={addStory}
        deleteStory={deleteStory}
        storyImageRefs={storyImageRefs}
      />
    </>
  );
}

export default Story;