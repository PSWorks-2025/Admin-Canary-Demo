import React, { useState,useContext } from "react";
import HeroSection from "./StoriesSection/HeroSection";
import StoriesSection from "./StoriesSection/StoriesSection";
import "./styles.css";
import { ColorContext } from "../../layout";

function Story() {
  const { primaryBackgroundColor, secondaryBackgroundColor, tertiaryBackgroundColor } = useContext(ColorContext);
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
    if (file instanceof File || file instanceof Blob) {
      console.log(`Uploading hero image for field ${field}`);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          [field]: e.target.result,
        }));
        console.log(`Hero image uploaded for field ${field}`);
      };
      reader.readAsDataURL(file);
    } else {
      console.error(`Invalid file provided for hero image ${field}:`, file);
    }
  };

  const handleStoryImageUpload = (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      console.log(`Uploading story image at index ${index}`);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          stories: prevData.stories.map((story, i) =>
            i === index ? { ...story, imageUrl: e.target.result } : story
          ),
        }));
        console.log(`Story image uploaded at index ${index}`);
      };
      reader.readAsDataURL(file);
    } else {
      console.error(`Invalid file provided for story image at index ${index}:`, file);
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
  };

  const deleteStory = (index) => {
    console.log(`Deleting story at index ${index}`);
    setPageData((prevData) => {
      const updatedStories = prevData.stories.filter((_, i) => i !== index);
      console.log("Updated stories:", updatedStories);
      return { ...prevData, stories: updatedStories };
    });
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={pageData.heroTitle}
        heroDescription={pageData.heroDescription}
        heroImage={pageData.heroImage}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
        buttonColor={secondaryBackgroundColor}
      />
      <div className="border-b-black border-b-3"></div>

      <StoriesSection
        heading={pageData.heading}
        stories={pageData.stories}
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