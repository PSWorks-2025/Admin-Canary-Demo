import { useCallback, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db,storage } from "../service/firebaseConfig";
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const useStoryData = (mainData, setMainData) => {
  // Normalize story_overviews.posted_time to ensure Timestamps
  useEffect(() => {
    if (mainData.story_overviews && Object.values(mainData.story_overviews).some(story => 
      story.posted_time && !(story.posted_time instanceof Timestamp)
    )) {
      const normalizedStories = Object.entries(mainData.story_overviews).reduce((acc, [key, story]) => ({
        ...acc,
        [key]: {
          ...story,
          posted_time: story.posted_time instanceof Date 
            ? Timestamp.fromDate(story.posted_time) 
            : story.posted_time || null,
        },
      }), {});
      updateMainData({ story_overviews: normalizedStories });
    }
  }, [mainData.story_overviews]);

  const mergeNested = useCallback((target, source) => {
    const output = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) && !(source[key] instanceof Timestamp) && !(source[key] instanceof Date)) {
        output[key] = mergeNested(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }, []);

  const updateMainData = async (updates) => {
    try {
      let updatedData;
      setMainData((prev) => {
        updatedData = mergeNested(prev, updates);
        return updatedData;
      });
      const docRef = doc(db, "Main pages", "components");
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      setMainData(mainData); // Revert on error
    }
  };

  const debouncedUpdateMainData = useCallback(debounce(updateMainData, 500), [mainData, setMainData]);

  const updateHeroField = useCallback(async (field, value) => {
    await debouncedUpdateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        stories: { ...mainData.hero_sections.stories, [field]: value },
      },
    });
  }, [mainData.hero_sections, debouncedUpdateMainData]);

  const uploadHeroImage = useCallback(async (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/stories/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateMainData({
          hero_sections: {
            ...mainData.hero_sections,
            stories: { ...mainData.hero_sections.stories, [field]: downloadUrl },
          },
        });
      } catch (error) {
        console.error(`Error uploading hero image for ${field}:`, error);
      }
    }
  }, [mainData.hero_sections]);

  const updateStoryField = useCallback(async (key, field, value) => {
    await debouncedUpdateMainData({
      story_overviews: {
        ...mainData.story_overviews,
        [key]: {
          ...mainData.story_overviews[key] || { title: "", abstract: "", thumbnail: { src: "", alt: "", caption: "" }, posted_time: null },
          [field === "description" ? "abstract" : field]: field === "posted_time" && value ? Timestamp.fromDate(new Date(value)) : value,
          thumbnail: {
            ...mainData.story_overviews[key]?.thumbnail || { src: "", alt: "", caption: "" },
            title: field === "title" ? value : mainData.story_overviews[key]?.title || "",
          },
        },
      },
    });
  }, [mainData.story_overviews, debouncedUpdateMainData]);

  const uploadStoryImage = useCallback(async (key, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `stories/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateMainData({
          story_overviews: {
            ...mainData.story_overviews,
            [key]: {
              ...mainData.story_overviews[key] || { title: "", abstract: "", thumbnail: { src: "", alt: "", caption: "" }, posted_time: null },
              thumbnail: {
                ...mainData.story_overviews[key]?.thumbnail || { src: "", alt: "", caption: "" },
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading story image for ${key}:`, error);
      }
    }
  }, [mainData.story_overviews]);

  const addStory = useCallback(async () => {
    const newKey = `Câu Chuyện_${Object.keys(mainData.story_overviews).length}_${new Date().toISOString()}`;
    await updateMainData({
      story_overviews: {
        ...mainData.story_overviews,
        [newKey]: {
          title: "",
          abstract: "",
          thumbnail: { src: "", alt: "", caption: "" },
          posted_time: null,
        },
      },
    });
  }, [mainData.story_overviews]);

  const deleteStory = useCallback(async (key) => {
    await updateMainData({
      story_overviews: {
        ...Object.keys(mainData.story_overviews)
          .filter((k) => k !== key)
          .reduce((acc, k) => ({ ...acc, [k]: mainData.story_overviews[k] }), {}),
      },
    });
  }, [mainData.story_overviews]);

  const storiesData = {
    heading: mainData.hero_sections?.stories?.title || "Câu chuyện",
    stories: Object.entries(mainData.story_overviews || {}).map(([key, story]) => ({
      id: key,
      title: story.title || "",
      description: story.abstract || "",
      imageUrl: story.thumbnail?.src || "",
      posted_time: story.posted_time instanceof Timestamp 
        ? story.posted_time.toDate().toISOString().split("T")[0] 
        : "",
    })),
  };

  return {
    storiesData,
    updateHeroField,
    uploadHeroImage,
    updateStoryField,
    uploadStoryImage,
    addStory,
    deleteStory,
    updateMainData,
  };
};

export default useStoryData;