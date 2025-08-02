import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
import HeroSection from '../../components/HomePageSection/HeroSection/index.jsx';
import StatsSection from '../../components/HomePageSection/StatsSection/index.jsx';
import EventsSection from '../../components/HomePageSection/EventSection/index.jsx';
import StorySection from '../../components/HomePageSection/StorySection/index.jsx';
import SaveFloatingButton from '../../globalComponent/SaveButton/index.jsx';
import GlobalContext from '../../GlobalContext.jsx';

const HomePage = () => {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    mainData,
    setMainData,
    heroSections,
    setHeroSections,
    orgStats,
    setOrgStats,
    eventOverviews,
    setEventOverviews,
    storyOverviews,
    setStoryOverviews,
    sectionTitles,
    setSectionTitles,
    enqueueImageUpload,
    handleGlobalSave,
  } = useContext(GlobalContext);

  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const handleEventsSectionTitleChange = (value) => {
    setSectionTitles((prev) => ({ ...prev, events: value }));
    setHasPendingChanges(true);
  };

  const handleStoriesSectionTitleChange = (value) => {
    setSectionTitles((prev) => ({ ...prev, stories: value }));
    setHasPendingChanges(true);
  };

  const saveUpdates = async () => {
    try {
      await handleGlobalSave();
      setHasPendingChanges(false);
      console.log('✅ HomePage data saved successfully!');
    } catch (err) {
      console.error('❌ Save error:', err);
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
        enqueueImageUpload={enqueueImageUpload}
      />

      <EventsSection
        data={eventOverviews}
        setData={setEventOverviews}
        sectionTitle={sectionTitles.events} 
        setSectionTitle={handleEventsSectionTitleChange}
        buttonColor={secondaryBackgroundColor}
        enqueueImageUpload={enqueueImageUpload}
      />

      <div className="w-full">
        <StorySection
          data={storyOverviews}
          setData={setStoryOverviews}
          title={sectionTitles.stories}
          setTitle={handleStoriesSectionTitleChange}
          buttonColor={secondaryBackgroundColor}
          enqueueImageUpload={enqueueImageUpload}
        />
      </div>
      <SaveFloatingButton visible={hasPendingChanges} onSave={saveUpdates} />
    </div>
  );
};

export default HomePage;