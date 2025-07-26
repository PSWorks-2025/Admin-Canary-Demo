import React, { useContext, useCallback } from "react";
import { motion } from "framer-motion";
import HeroSection from "../../components/EventsSection/HeroSection/index.jsx";
import DonateOverview from "../../components/DonateOverview/DonateOverview";
import ProjectOverview from "../../components/projectOverview/ProjectOverview";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import EventsOverview from "../../components/EventsOverview/EventsOverview";
import "./styles.css";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import GlobalContext from "../../GlobalContext.jsx";

function Events() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    heroSections,
    setHeroSections,
    projectOverviews,
    setProjectOverviews,
    eventOverviews,
    setEventOverviews,
    enqueueImageUpload,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    heroSections?.events?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ...(heroSections?.donate?.images || ["", ""]).map(
      (img) => img || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
    ...Object.values(projectOverviews || {}).map(
      (project) => project.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
    ...Object.values(eventOverviews || {}).map(
      (event) => event.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const updateHeroField = useCallback((field, value) => {
    setHeroSections((prev) => ({
      ...prev,
      events: { ...prev.events, [field]: value },
    }));
  }, [setHeroSections]);

  const updateHeroImage = useCallback(
    (file) => {
      if (file instanceof File || file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero/events/${file.name}`;
        enqueueImageUpload(`main_pages.hero_sections.events.image`, storagePath, file);
        setHeroSections((prev) => ({
          ...prev,
          events: { ...prev.events, image: blobUrl },
        }));
      }
    },
    [setHeroSections, enqueueImageUpload]
  );

  const updateDonateField = useCallback((field, value) => {
    setHeroSections((prev) => ({
      ...prev,
      donate: { ...prev.donate, [field]: value },
    }));
  }, [setHeroSections]);

  const updateDonateImage = useCallback(
    (index, file) => {
      if (file instanceof File || file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero/donate/${file.name}`;
        enqueueImageUpload(`main_pages.hero_sections.donate.images.${index}`, storagePath, file);
        setHeroSections((prev) => {
          const newImages = [...(prev.donate.images || ["", ""])];
          newImages[index] = blobUrl;
          return {
            ...prev,
            donate: { ...prev.donate, images: newImages },
          };
        });
      }
    },
    [setHeroSections, enqueueImageUpload]
  );

  const updateProjectField = useCallback(
    (id, field, value) => {
      const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
      const dateValue = field === "started_time" && value && isValidDate(value) ? value : value;
      setProjectOverviews((prev) => ({
        ...prev,
        [id]: {
          ...prev[id] || {
            title: "",
            abstract: "",
            thumbnail: { src: "", alt: "", caption: "" },
            started_time: null,
          },
          [field === "description" ? "abstract" : field]: dateValue,
          thumbnail: {
            ...prev[id]?.thumbnail || { src: "", alt: "", caption: "" },
            title: field === "title" ? value : prev[id]?.title || "",
          },
        },
      }));
    },
    [setProjectOverviews]
  );

  const updateProjectImage = useCallback(
    (id, file) => {
      if (file instanceof File || file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `projects/${file.name}`;
        enqueueImageUpload(`main_pages.project_overviews.${id}.thumbnail.src`, storagePath, file);
        setProjectOverviews((prev) => ({
          ...prev,
          [id]: {
            ...prev[id] || {
              title: "",
              abstract: "",
              thumbnail: { src: "", alt: "", caption: "" },
              started_time: null,
            },
            thumbnail: {
              ...prev[id]?.thumbnail || { src: "", alt: "", caption: "" },
              src: blobUrl,
            },
          },
        }));
      }
    },
    [setProjectOverviews, enqueueImageUpload]
  );

  const updateEventsField = useCallback(
    (id, field, value) => {
      setEventOverviews((prev) => ({
        ...prev,
        [id]: {
          ...prev[id] || {
            title: "",
            abstract: "",
            thumbnail: { src: "", alt: "", caption: "" },
          },
          [field === "description" ? "abstract" : field]: value,
          thumbnail: {
            ...prev[id]?.thumbnail || { src: "", alt: "", caption: "" },
            title: field === "title" ? value : prev[id]?.title || "",
          },
        },
      }));
    },
    [setEventOverviews]
  );

  const updateEventsImage = useCallback(
    (id, file) => {
      if (file instanceof File || file instanceof Blob) {
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `events/${file.name}`;
        enqueueImageUpload(`main_pages.event_overviews.${id}.thumbnail.src`, storagePath, file);
        setEventOverviews((prev) => ({
          ...prev,
          [id]: {
            ...prev[id] || {
              title: "",
              abstract: "",
              thumbnail: { src: "", alt: "", caption: "" },
            },
            thumbnail: {
              ...prev[id]?.thumbnail || { src: "", alt: "", caption: "" },
              src: blobUrl,
            },
          },
        }));
      }
    },
    [setEventOverviews, enqueueImageUpload]
  );

  const createProject = useCallback(() => {
    const newId = `Dự Án_${Object.keys(projectOverviews).length}_${new Date().toISOString()}`;
    setProjectOverviews((prev) => ({
      ...prev,
      [newId]: {
        title: "",
        abstract: "",
        thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
        started_time: null,
      },
    }));
  }, [projectOverviews, setProjectOverviews]);

  const removeProject = useCallback(
    (id) => {
      setProjectOverviews((prev) => {
        const newProjects = Object.keys(prev)
          .filter((key) => key !== id)
          .reduce((acc, key) => ({ ...acc, [key]: prev[key] }), {});
        return newProjects;
      });
    },
    [setProjectOverviews]
  );

  const createEvent = useCallback(() => {
    const newId = `Sự Kiện_${Object.keys(eventOverviews).length}_${new Date().toISOString()}`;
    setEventOverviews((prev) => ({
      ...prev,
      [newId]: {
        title: "",
        abstract: "",
        thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
      },
    }));
  }, [eventOverviews, setEventOverviews]);

  const removeEvent = useCallback(
    (id) => {
      setEventOverviews((prev) => {
        const newEvents = Object.keys(prev)
          .filter((key) => key !== id)
          .reduce((acc, key) => ({ ...acc, [key]: prev[key] }), {});
        return newEvents;
      });
    },
    [setEventOverviews]
  );

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
        started_time: projectOverviews[Object.keys(projectOverviews)[0]].started_time || "",
      }
    : {
        heading: "Tổng quan dự án",
        title: "",
        description: "",
        images: [],
        started_time: "",
      };

  const donateOverview = {
    heading: "Hãy đồng hành cùng chúng mình",
    title1: heroSections?.donate?.title1 || "Đặt mua bánh chưng",
    title2: heroSections?.donate?.title2 || "Ủng hộ hiện kim",
    images: heroSections?.donate?.images || [
      "https://blog.photobucket.com/hubfs/upload_pics_online.png",
      "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ],
  };

  const eventsOverview = {
    heading: "Tổng kết các sự kiện đã qua",
    events: Object.entries(eventOverviews).map(([key, event]) => ({
      id: key,
      title: event.title || "",
      imageUrl: event.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    })),
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        title={heroSections?.events?.title}
        description={heroSections?.events?.description}
        backgroundImage={heroSections?.events?.image}
        onFieldChange={updateHeroField}
        onImageUpload={updateHeroImage}
      />
      <div className="projects">
        {/* <ProjectOverview
          pageData={projectOverview}
          onFieldChange={updateProjectField}
          onImageUpload={updateProjectImage}
          buttonColor={secondaryBackgroundColor}
        /> */}
        <DonateOverview
          pageData={donateOverview}
          onFieldChange={updateDonateField}
          onImageUpload={updateDonateImage}
          buttonColor={secondaryBackgroundColor}
        />
        <ProjectLayout
          projects={projectOverviews}
          onChange={updateProjectField}
          onImageUpload={updateProjectImage}
          addProject={createProject}
          deleteProject={removeProject}
          buttonColor={secondaryBackgroundColor}
        />
        <EventsOverview
          pageData={eventsOverview}
          onFieldChange={updateEventsField}
          onImageUpload={updateEventsImage}
          addEvent={createEvent}
          deleteEvent={removeEvent}
          buttonColor={secondaryBackgroundColor}
        />
      </div>
    </div>
  );
}

export default Events;