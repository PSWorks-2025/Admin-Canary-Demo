import PropTypes from 'prop-types';
import { useState, useContext } from 'react';
// import HeroSection from '../../components/HomePageSection/HeroSection/index.jsx';
import HeroSection from '../../../Section-And-Core-Component/CanarySectionsModel/Home/HeroSection/HomeHeroSectionEditor';
import StatsHighlightEditor from '../../../Section-And-Core-Component/CanarySectionsModel/Home/StatHighlight/StatHighlightEditor/index.jsx';
import EventsHighlightEditor from '../../../Section-And-Core-Component/CanarySectionsModel/Home/EventsHighlight/EventsHighlightEditor';
import StoriesHighlightEditor from '../../../Section-And-Core-Component/CanarySectionsModel/Home/StoriesHighlight/StoriesHighlightEditor';
import SaveFloatingButton from '../../globalComponent/SaveButton/index.jsx';
import GlobalContext from '../../GlobalContext.jsx';
import { generateNextId } from '../../utils/idUtils.js';

const HomePage = () => {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
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
    <div className="w-full pb-10" style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection heroSections={heroSections} setHeroSections={setHeroSections} enqueueImageUpload={enqueueImageUpload} />

      <StatsHighlightEditor data={orgStats} setData={setOrgStats} setHasPendingChanges={setHasPendingChanges} />

      <EventsHighlightEditor
        eventOverviews={eventOverviews}
        setEventOverviews={setEventOverviews}
        sectionTitle={sectionTitles.events}
        setSectionTitle={handleEventsSectionTitleChange}
        buttonColor={secondaryBackgroundColor}
        enqueueImageUpload={enqueueImageUpload}
        generateNextId={generateNextId}
      />

      <div className="w-full">
        <StoriesHighlightEditor
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
