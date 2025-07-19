import React, { useContext, useEffect, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import HeroSection from '../../components/StoriesSection/HeroSection/index.jsx';
import StoriesSection from '../../components/StoriesSection/StoriesSection';
import './styles.css';
import { db, storage } from '../../service/firebaseConfig.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import GlobalContext from '../../GlobalContext.jsx';

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function Story() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    mainData,
    setMainData,
  } = useContext(GlobalContext);

  // Normalize story_overviews.posted_time to ensure Timestamps
  useEffect(() => {
    if (
      mainData.story_overviews &&
      Object.values(mainData.story_overviews).some(
        (story) =>
          story.posted_time && !(story.posted_time instanceof Timestamp)
      )
    ) {
      const normalizedStories = Object.entries(mainData.story_overviews).reduce(
        (acc, [key, story]) => ({
          ...acc,
          [key]: {
            ...story,
            posted_time:
              story.posted_time instanceof Date
                ? Timestamp.fromDate(story.posted_time)
                : story.posted_time || null,
          },
        }),
        {}
      );
      updateMainData({ story_overviews: normalizedStories });
    }
    console.log('mainData.story_overviews:', mainData.story_overviews);
  }, [mainData.story_overviews]);

  // Merge utility for nested objects
  const mergeNested = useCallback((target, source) => {
    const output = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        !(source[key] instanceof Timestamp) &&
        !(source[key] instanceof Date)
      ) {
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
        console.log('setMainData called with:', updatedData);
        return updatedData;
      });
      const docRef = doc(db, 'Main pages', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully:', updatedData);
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setMainData(mainData); // Revert on error
    }
  };

  // Debounced updateMainData
  const debouncedUpdateMainData = useCallback(debounce(updateMainData, 500), [
    mainData,
    setMainData,
  ]);

  const updateHeroField = useCallback(
    async (field, value) => {
      console.log('updateHeroField:', { field, value });
      await debouncedUpdateMainData({
        hero_sections: {
          ...mainData.hero_sections,
          stories: { ...mainData.hero_sections.stories, [field]: value },
        },
      });
    },
    [mainData.hero_sections, debouncedUpdateMainData]
  );

  const uploadHeroImage = useCallback(
    async (field, file) => {
      if (file instanceof File || file instanceof Blob) {
        try {
          const storageRef = ref(storage, `hero/stories/${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);
          await updateMainData({
            hero_sections: {
              ...mainData.hero_sections,
              stories: {
                ...mainData.hero_sections.stories,
                [field]: downloadUrl,
              },
            },
          });
        } catch (error) {
          console.error(`Error uploading hero image for ${field}:`, error);
        }
      } else {
        console.error(`Invalid file for hero image ${field}:`, file);
      }
    },
    [mainData.hero_sections]
  );

  const updateStoryField = useCallback(
    async (key, field, value) => {
      console.log('updateStoryField:', { key, field, value });
      await debouncedUpdateMainData({
        story_overviews: {
          ...mainData.story_overviews,
          [key]: {
            ...(mainData.story_overviews[key] || {
              title: '',
              abstract: '',
              thumbnail: { src: '', alt: '', caption: '' },
              posted_time: null,
            }),
            [field === 'description' ? 'abstract' : field]:
              field === 'posted_time' && value
                ? Timestamp.fromDate(new Date(value))
                : value,
            thumbnail: {
              ...(mainData.story_overviews[key]?.thumbnail || {
                src: '',
                alt: '',
                caption: '',
              }),
              title:
                field === 'title'
                  ? value
                  : mainData.story_overviews[key]?.title || '',
            },
          },
        },
      });
    },
    [mainData.story_overviews, debouncedUpdateMainData]
  );

  const uploadStoryImage = useCallback(
    async (key, file) => {
      if (file instanceof File || file instanceof Blob) {
        try {
          const storageRef = ref(storage, `stories/${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadUrl = await getDownloadURL(storageRef);
          await updateMainData({
            story_overviews: {
              ...mainData.story_overviews,
              [key]: {
                ...(mainData.story_overviews[key] || {
                  title: '',
                  abstract: '',
                  thumbnail: { src: '', alt: '', caption: '' },
                  posted_time: null,
                }),
                thumbnail: {
                  ...(mainData.story_overviews[key]?.thumbnail || {
                    src: '',
                    alt: '',
                    caption: '',
                  }),
                  src: downloadUrl,
                },
              },
            },
          });
        } catch (error) {
          console.error(`Error uploading story image for ${key}:`, error);
        }
      } else {
        console.error(`Invalid file for story image ${key}:`, file);
      }
    },
    [mainData.story_overviews]
  );

  const addStory = useCallback(async () => {
    const newKey = `Câu Chuyện_${
      Object.keys(mainData.story_overviews).length
    }_${new Date().toISOString()}`;
    await updateMainData({
      story_overviews: {
        ...mainData.story_overviews,
        [newKey]: {
          title: '',
          abstract: '',
          thumbnail: { src: '', alt: '', caption: '' },
          posted_time: null,
        },
      },
    });
  }, [mainData.story_overviews]);

  const deleteStory = useCallback(
    async (key) => {
      console.log(`Deleting story with key ${key}`);
      await updateMainData({
        story_overviews: {
          ...Object.keys(mainData.story_overviews)
            .filter((k) => k !== key)
            .reduce(
              (acc, k) => ({ ...acc, [k]: mainData.story_overviews[k] }),
              {}
            ),
        },
      });
    },
    [mainData.story_overviews]
  );

  const storiesData = {
    heading: mainData.hero_sections.stories.title || 'Câu chuyện',
    stories: Object.entries(mainData.story_overviews).map(([key, story]) => ({
      id: key,
      title: story.title || '',
      description: story.abstract || '',
      imageUrl: story.thumbnail?.src || '',
      posted_time:
        story.posted_time instanceof Timestamp
          ? story.posted_time.toDate().toISOString().split('T')[0]
          : '',
    })),
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        heroTitle={mainData.hero_sections.stories.title || ''}
        heroDescription={mainData.hero_sections.stories.description || ''}
        heroImage={mainData.hero_sections.stories.image || ''}
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
    </div>
  );
}

export default Story;
