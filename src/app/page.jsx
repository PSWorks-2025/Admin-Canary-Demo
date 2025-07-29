import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import HeroSection from '../components/HomePageSection/HeroSection';
import StatsSection from '../components/HomePageSection/StatsSection';
import EventsSection from '../components/HomePageSection/EventSection';
import {
  ScrollStoryList,
  ScrollStoryListItem,
} from '../components/Lists/ScrollStoryList.jsx';
import { TextInput } from '../components/Inputs/TextInput.jsx';
import { db } from '../service/firebaseConfig.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { uploadImageToStorage } from '../service/firebaseWrite.jsx';
import SaveFloatingButton from '../globalComponent/SaveButton/index.jsx';
import StorySection from '../components/HomePageSection/StorySection/index.jsx';
import GlobalContext from '../GlobalContext';
import { FaLessThan } from 'react-icons/fa';

const HomePage = () => {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    mainData,
    setMainData,
  } = useContext(GlobalContext);

  const [heroSections, setHeroSections] = useState(mainData.hero_sections);
  const [orgStats, setOrgStats] = useState(mainData.org_stats);
  const [eventOverviews, setEventOverviews] = useState(
    mainData.event_overviews
  );
  const [storyOverviews, setStoryOverviews] = useState(
    mainData.story_overviews
  );
  const [storiesTitle, setStoriesTitle] = useState(
    mainData?.hero_sections?.stories?.title || ''
  );

  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [imageUploadQueue, setImageUploadQueue] = useState([]);

  const enqueueImageUpload = ({ section, key, file, path }) => {
    const tempUrl = URL.createObjectURL(file);

    if (section === 'hero') {
      setHeroSections((prev) => ({
        ...prev,
        home: { ...prev.home, image: tempUrl },
      }));
    } else if (section === 'events') {
      setEventOverviews((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          thumbnail: { ...prev[key].thumbnail, src: tempUrl },
        },
      }));
    } else if (section === 'stories') {
      setStoryOverviews((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          thumbnail: { ...prev[key].thumbnail, src: tempUrl },
        },
      }));
    }

    setImageUploadQueue((prev) => [...prev, { section, key, file, path }]);
    setHasPendingChanges(true);
  };

  const handleFirstSectionChange = (value) => {
    setHeroSections((prev) => ({
      ...prev,
      events: { ...prev.events, title: value },
    }));
    setHasPendingChanges(true);
  };

  const saveUpdates = async () => {
    try {
      const updatedHeroSections = { ...heroSections };

      for (const { section, key, file, path } of imageUploadQueue) {
        const url = await uploadImageToStorage(path, file);
        if (!url) continue;

        if (section === 'hero') {
          updatedHeroSections.home.image = url;
        } else if (section === 'events') {
          eventOverviews[key].thumbnail.src = url;
        } else if (section === 'stories') {
          storyOverviews[key].thumbnail.src = url;
        }
      }

      const docRef = doc(db, 'Main pages', 'components');
      const mergedData = {
        org_stats: orgStats,
        hero_sections: {
          ...updatedHeroSections,
          stories: { ...updatedHeroSections.stories, title: storiesTitle },
        },
        event_overviews: eventOverviews,
        story_overviews: storyOverviews,
      };
      await updateDoc(docRef, mergedData);
      setMainData(mergedData);
      setHasPendingChanges(false);
      setImageUploadQueue([]);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      console.log('Finished Saving');
    }
  };

  return (
    <div
      className="w-full pb-10"
      style={{ backgroundColor: primaryBackgroundColor }}
    >
      <HeroSection
        data={heroSections}
        setData={setHeroSections}
        enqueueImageUpload={enqueueImageUpload}
      />

      <StatsSection
        data={orgStats}
        setData={setOrgStats}
        setHasPendingChanges={setHasPendingChanges}
      />

      <EventsSection
        data={eventOverviews}
        setData={setEventOverviews}
        sectionTitle={heroSections?.events?.title}
        setSectionTitle={handleFirstSectionChange}
        enqueueImageUpload={enqueueImageUpload}
        buttonColor={secondaryBackgroundColor}
      />

      <div className="w-full">
        <StorySection
          data={storyOverviews}
          setData={setStoryOverviews}
          title={storiesTitle}
          setTitle={setStoriesTitle}
          enqueueImageUpload={enqueueImageUpload}
          buttonColor={secondaryBackgroundColor}
        />
      </div>
      <SaveFloatingButton onSave={saveUpdates} />
    </div>
  );
};

export default HomePage;