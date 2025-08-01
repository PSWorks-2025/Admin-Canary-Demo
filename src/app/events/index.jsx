import React, { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/EventsSection/HeroSection/index.jsx';
import DonateOverview from '../../components/DonateOverview/DonateOverview.jsx';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout.jsx';
import EventsOverview from '../../components/EventsOverview/EventsOverview.jsx';
import './styles.css';
import useImagePreloader from '../../hooks/useImagePreloader.js';
import LoadingScreen from '../../components/screens/LoadingScreen.jsx';
import GlobalContext from '../../GlobalContext.jsx';

function Events() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
    heroSections,
    setHeroSections,
    projectOverviews,
    setProjectOverviews,
    eventOverviews,
    setEventOverviews,
    sectionTitles,
    setSectionTitles,
    enqueueImageUpload,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    heroSections?.events?.image ||
      'https://blog.photobucket.com/hubfs/upload_pics_online.png',
    ...(heroSections?.donate?.images || ['', '']).map(
      (img) =>
        img || 'https://blog.photobucket.com/hubfs/upload_pics_online.png'
    ),
    ...Object.values(projectOverviews || {}).map(
      (project) =>
        project.thumbnail?.src ||
        'https://blog.photobucket.com/hubfs/upload_pics_online.png'
    ),
    ...Object.values(eventOverviews || {}).map(
      (event) =>
        event.thumbnail?.src ||
        'https://blog.photobucket.com/hubfs/upload_pics_online.png'
    ),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const [hasChanges, setHasChanges] = useState(false);

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  const projectOverview = Object.keys(projectOverviews).length > 0
    ? {
        heading: "Tổng quan dự án",
        title: projectOverviews[Object.keys(projectOverviews)[0]].title || "",
        description: projectOverviews[Object.keys(projectOverviews)[0]].abstract || "",
        images: Object.values(projectOverviews).map(
          (project) => project.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
        ),
        started_time: (() => {
          const startedTime = projectOverviews[Object.keys(projectOverviews)[0]].started_time;
          try {
            const date = startedTime?.toDate ? startedTime.toDate() : new Date(startedTime);
            return date instanceof Date && !isNaN(date.getTime()) ? date.toISOString() : "";
          } catch (error) {
            console.error("Invalid started_time in projectOverview:", startedTime, error);
            return "";
          }
        })(),
      }
    : {
        heading: "Tổng quan dự án",
        title: "",
        description: "",
        images: [],
        started_time: "",
      };

  const donateOverview = {
    heading: 'Hãy đồng hành cùng chúng mình',
    title1: heroSections?.donate?.title1 || 'Đặt mua bánh chưng',
    title2: heroSections?.donate?.title2 || 'Ủng hộ hiện kim',
    images: heroSections?.donate?.images || [
      'https://blog.photobucket.com/hubfs/upload_pics_online.png',
      'https://blog.photobucket.com/hubfs/upload_pics_online.png',
    ],
  };

  const eventsOverview = {
    heading: 'Tổng kết các sự kiện đã qua',
    events: Object.entries(eventOverviews).map(([key, event]) => ({
      id: key,
      title: event.title || '',
      imageUrl:
        event.thumbnail?.src ||
        'https://blog.photobucket.com/hubfs/upload_pics_online.png',
    })),
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }} className="w-full pt-20 pb-20">
        <HeroSection
          title={heroSections?.events?.title}
          description={heroSections?.events?.description}
          backgroundImage={heroSections?.events?.image}
          setHeroSections={setHeroSections}
          enqueueImageUpload={enqueueImageUpload}
          setHasChanges={setHasChanges}
        />
      <div className="projects">
          <DonateOverview
            pageData={donateOverview}
            setHeroSections={setHeroSections}
            enqueueImageUpload={enqueueImageUpload}
            setHasChanges={setHasChanges}
            buttonColor={secondaryBackgroundColor}
          />
          <ProjectLayout
            projects={projectOverviews}
            setProjectOverviews={setProjectOverviews}
            enqueueImageUpload={enqueueImageUpload}
            setHasChanges={setHasChanges}
            buttonColor={secondaryBackgroundColor}
            sectionTitles={sectionTitles}
            setSectionTitles={setSectionTitles}
          />
          <EventsOverview
            pageData={eventsOverview}
            setEventOverviews={setEventOverviews}
            enqueueImageUpload={enqueueImageUpload}
            setHasChanges={setHasChanges}
            buttonColor={secondaryBackgroundColor}
            tertiaryBackgroundColor={tertiaryBackgroundColor}
          />
      </div>
    </div>
  );
}

export default Events;
