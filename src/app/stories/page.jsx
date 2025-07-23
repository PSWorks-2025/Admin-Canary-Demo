import React, { useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import HeroSection from "../../components/StoriesSection/HeroSection";
import StoriesSection from "../../components/StoriesSection/StoriesSection";
import { ColorContext } from "../../layout";
import { db, storage } from "../../service/firebaseConfig";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import SaveFloatingButton from "../../globalComponent/SaveButton";

function Story({ mainData, setMainData }) {
  const { primaryBackgroundColor, secondaryBackgroundColor } = useContext(ColorContext);
  const [localData, setLocalData] = useState({
    hero_sections: { stories: { title: "", description: "", image: "" } },
    story_overviews: {},
  });
  const [pendingImages, setPendingImages] = useState([]);
  const imagesToPreload = [
    localData.hero_sections?.stories?.image || "https://via.placeholder.com/1200x600",
    ...Object.values(localData.story_overviews || {}).map(
      (story) => story.thumbnail?.src || "https://via.placeholder.com/144x144"
    ),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  useEffect(() => {
    const fetchData = async () => {
      const data = mainData || {};
      setLocalData({
        hero_sections: {
          stories: {
            title: data.hero_sections?.stories?.title || "",
            description: data.hero_sections?.stories?.description || "",
            image: data.hero_sections?.stories?.image || "https://via.placeholder.com/1200x600",
          },
        },
        story_overviews: Object.entries(data.story_overviews || {}).reduce(
          (acc, [key, story]) => ({
            ...acc,
            [key]: {
              ...story,
              posted_time: story.posted_time || null, // Ensure posted_time is null if not provided
              thumbnail: {
                src: story.thumbnail?.src || "",
                alt: story.thumbnail?.alt || "",
                caption: story.thumbnail?.caption || "",
              },
            },
          }),
          {}
        ),
      });
    };
    fetchData();
  }, [mainData]); // Added mainData as a dependency to re-run if it changes

  const updateHeroField = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      hero_sections: {
        ...prev.hero_sections,
        stories: { ...prev.hero_sections.stories, [field]: value },
      },
    }));
  };

  const updateHeroImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [
        ...prev.filter((img) => img.field !== field || img.key !== "hero"),
        { field, key: "hero", file, blobUrl },
      ]);
      setLocalData((prev) => ({
        ...prev,
        hero_sections: {
          ...prev.hero_sections,
          stories: { ...prev.hero_sections.stories, [field]: blobUrl },
        },
      }));
    }
  };

  const updateStoryField = (key, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      story_overviews: {
        ...prev.story_overviews,
        [key]: {
          ...prev.story_overviews[key],
          [field === "description" ? "abstract" : field]: value,
          thumbnail: {
            ...prev.story_overviews[key].thumbnail,
            title: field === "title" ? value : prev.story_overviews[key].title,
          },
        },
      },
    }));
  };

  const updateStoryImage = (key, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [
        ...prev.filter((img) => img.key !== key),
        { field: "thumbnail.src", key, file, blobUrl },
      ]);
      setLocalData((prev) => ({
        ...prev,
        story_overviews: {
          ...prev.story_overviews,
          [key]: {
            ...prev.story_overviews[key],
            thumbnail: { ...prev.story_overviews[key].thumbnail, src: blobUrl },
          },
        },
      }));
    }
  };

  const addStory = () => {
    const newKey = `Câu Chuyện_${Object.keys(localData.story_overviews).length}_${new Date().toISOString()}`;
    setLocalData((prev) => ({
      ...prev,
      story_overviews: {
        ...prev.story_overviews,
        [newKey]: {
          title: "",
          abstract: "",
          thumbnail: { src: "", alt: "", caption: "" },
          posted_time: new Date().toISOString(), // Set a valid default date
        },
      },
    }));
  };

  const deleteStory = (key) => {
    setLocalData((prev) => {
      const newStories = Object.keys(prev.story_overviews)
        .filter((k) => k !== key)
        .reduce((acc, k) => ({ ...acc, [k]: prev.story_overviews[k] }), {});
      return { ...prev, story_overviews: newStories };
    });
    setPendingImages((prev) => prev.filter((img) => img.key !== key));
  };

  const saveChanges = async () => {
    try {
      // Upload pending images to Firebase Storage
      const imageUpdates = {};
      for (const { field, key, file } of pendingImages) {
        const storagePath = key === "hero" ? `hero/stories/${file.name}` : `stories/${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUpdates[`${key}.${field}`] = downloadUrl;
        URL.revokeObjectURL(file); // Clean up Blob URL
      }

      // Apply image updates to localData
      const updatedMainData = { ...localData };
      Object.entries(imageUpdates).forEach(([keyField, url]) => {
        const [key, field] = keyField.split(".");
        if (key === "hero") {
          updatedMainData.hero_sections.stories[field] = url;
        } else {
          updatedMainData.story_overviews[key].thumbnail[field] = url;
        }
      });

      // Save to Firestore
      const docRef = doc(db, "Main pages", "components");
      await updateDoc(docRef, {
        hero_sections: updatedMainData.hero_sections,
        story_overviews: updatedMainData.story_overviews,
      });

      // Update state
      setLocalData(updatedMainData);
      setMainData(updatedMainData); // Update parent state
      setPendingImages([]); // Clear pending images
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const storiesData = {
    heading: localData.hero_sections?.stories?.title || "Câu chuyện",
    stories: Object.entries(localData.story_overviews || {}).map(([key, story]) => {
      // Validate posted_time before creating Date object
      let formattedDate = "";
      if (story.posted_time) {
        const date = new Date(story.posted_time);
        if (!isNaN(date.getTime())) {
          // Only format if the date is valid
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

  // if (!imagesLoaded) {
  //   return <LoadingScreen />;
  // }

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={localData.hero_sections?.stories?.title || ""}
        heroDescription={localData.hero_sections?.stories?.description || ""}
        heroImage={localData.hero_sections?.stories?.image || "https://via.placeholder.com/1200x600"}
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
      <SaveFloatingButton visible={true} onSave={saveChanges} />
    </div>
  );
}

export default Story;