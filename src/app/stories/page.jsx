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

function Story() {
  const { primaryBackgroundColor, secondaryBackgroundColor } = useContext(ColorContext);
  const [mainData, setMainData] = useState({
    hero_sections: { stories: { title: "", description: "", image: "" } },
    story_overviews: {},
  });
  const [pendingImages, setPendingImages] = useState([]); // Array of { field, key, file, blobUrl }
  const imagesToPreload = [
    mainData.hero_sections?.stories?.image || "https://via.placeholder.com/1200x600",
    ...Object.values(mainData.story_overviews || {}).map((story) => story.thumbnail?.src || "https://via.placeholder.com/144x144"),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "Main pages", "components");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setMainData({
            hero_sections: {
              stories: {
                title: data.hero_sections?.stories?.title || "",
                description: data.hero_sections?.stories?.description || "",
                image: data.hero_sections?.stories?.image || "https://via.placeholder.com/1200x600",
              },
            },
            story_overviews: Object.entries(data.story_overviews || {}).reduce((acc, [key, story]) => ({
              ...acc,
              [key]: {
                ...story,
                posted_time: story.posted_time || null,
                thumbnail: { src: story.thumbnail?.src || "", alt: story.thumbnail?.alt || "", caption: story.thumbnail?.caption || "" },
              },
            }), {}),
          });
        }
      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };
    fetchData();
  }, []);

  const updateHeroField = (field, value) => {
    setMainData((prev) => ({
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
      setPendingImages((prev) => [...prev.filter((img) => img.field !== field || img.key !== "hero"), { field, key: "hero", file, blobUrl }]);
      setMainData((prev) => ({
        ...prev,
        hero_sections: {
          ...prev.hero_sections,
          stories: { ...prev.hero_sections.stories, [field]: blobUrl },
        },
      }));
    }
  };

  const updateStoryField = (key, field, value) => {
    setMainData((prev) => ({
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
      setPendingImages((prev) => [...prev.filter((img) => img.key !== key), { field: "thumbnail.src", key, file, blobUrl }]);
      setMainData((prev) => ({
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
    const newKey = `Câu Chuyện_${Object.keys(mainData.story_overviews).length}_${new Date().toISOString()}`;
    setMainData((prev) => ({
      ...prev,
      story_overviews: {
        ...prev.story_overviews,
        [newKey]: {
          title: "",
          abstract: "",
          thumbnail: { src: "", alt: "", caption: "" },
          posted_time: null,
        },
      },
    }));
  };

  const deleteStory = (key) => {
    setMainData((prev) => {
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

      // Apply image updates to mainData
      const updatedMainData = { ...mainData };
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
      setMainData(updatedMainData);
      setPendingImages([]); // Clear pending images
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  const storiesData = {
    heading: mainData.hero_sections?.stories?.title || "Câu chuyện",
    stories: Object.entries(mainData.story_overviews || {}).map(([key, story]) => ({
      id: key,
      title: story.title || "",
      description: story.abstract || "",
      imageUrl: story.thumbnail?.src || "https://via.placeholder.com/144x144",
      posted_time: story.posted_time ? new Date(story.posted_time).toISOString().split("T")[0] : "",
    })),
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={mainData.hero_sections?.stories?.title || ""}
        heroDescription={mainData.hero_sections?.stories?.description || ""}
        heroImage={mainData.hero_sections?.stories?.image || "https://via.placeholder.com/1200x600"}
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
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 group"
        onClick={saveChanges}
      >
        <span className="hidden group-hover:inline absolute -top-8 right-0 bg-gray-800 text-white text-sm px-2 py-1 rounded">Save Changes</span>
        Save
      </motion.button>
    </div>
  );
}

export default Story;