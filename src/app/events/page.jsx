import React, { useState, useEffect, useCallback,useContext } from "react";
import { motion } from "framer-motion";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import HeroSection from "../../components/EventsSection/HeroSection/index.jsx";
import DonateOverview from "../../components/DonateOverview/DonateOverview";
import ProjectOverview from "../../components/projectOverview/ProjectOverview";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import EventsOverview from "../../components/EventsOverview/EventsOverview";
import "./styles.css";
import { ColorContext } from "../../layout";
import { db, storage } from "../../service/firebaseConfig.jsx";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import SaveFloatingButton from "../../globalComponent/SaveButton/index.jsx";

function Events({mainData,setMainData}) {
  const { primaryBackgroundColor, secondaryBackgroundColor, tertiaryBackgroundColor } = useContext(ColorContext);
  const [localData, setLocalData] = useState({
    hero_sections: {
      events: { title: "", description: "", image: "" },
      donate: { title1: "", title2: "", images: ["", ""] },
    },
    project_overviews: {},
    event_overviews: {},
  });
  const [pendingImages, setPendingImages] = useState([]); // Array of { field, key, file, blobUrl }
  const imagesToPreload = [
    localData.hero_sections?.events?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ...(localData.hero_sections?.donate?.images || ["", ""]).map(
      (img) => img || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
    ...Object.values(localData.project_overviews || {}).map(
      (project) => project.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
    ...Object.values(localData.event_overviews || {}).map(
      (event) => event.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
    ),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  useEffect(() => {
    const fetchData = async () => {
      const data = mainData || {};  
          setLocalData({
            hero_sections: {
              events: {
                title: data.hero_sections?.events?.title || "",
                description: data.hero_sections?.events?.description || "",
                image: data.hero_sections?.events?.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
              },
              donate: {
                title1: data.hero_sections?.donate?.title1 || "",
                title2: data.hero_sections?.donate?.title2 || "",
                images: Array.isArray(data.hero_sections?.donate?.images)
                  ? data.hero_sections.donate.images.map(
                      (img) => img || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
                    )
                  : ["https://blog.photobucket.com/hubfs/upload_pics_online.png", "https://blog.photobucket.com/hubfs/upload_pics_online.png"],
              },
            },
            project_overviews: Object.entries(data.project_overviews || {}).reduce((acc, [key, project]) => ({
              ...acc,
              [key]: {
                title: project.title || "",
                abstract: project.abstract || "",
                thumbnail: {
                  src: project.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
                  alt: project.thumbnail?.alt || "",
                  caption: project.thumbnail?.caption || "",
                },
                started_time: project.started_time || null,
              },
            }), {}),
            event_overviews: Object.entries(data.event_overviews || {}).reduce((acc, [key, event]) => ({
              ...acc,
              [key]: {
                title: event.title || "",
                abstract: event.abstract || "",
                thumbnail: {
                  src: event.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
                  alt: event.thumbnail?.alt || "",
                  caption: event.thumbnail?.caption || "",
                },
              },
            }), {}),
          });
        }
      
    fetchData();
  }, []);

  const updateHeroField = useCallback((field, value) => {
    setLocalData((prev) => ({
      ...prev,
      hero_sections: {
        ...prev.hero_sections,
        events: { ...prev.hero_sections.events, [field]: value },
      },
    }));
  }, []);

  const updateHeroImage = useCallback((file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [
        ...prev.filter((img) => img.key !== "hero_events"),
        { field: "image", key: "hero_events", file, blobUrl },
      ]);
      setLocalData((prev) => ({
        ...prev,
        hero_sections: {
          ...prev.hero_sections,
          events: { ...prev.hero_sections.events, image: blobUrl },
        },
      }));
    }
  }, []);

  const updateDonateField = useCallback((field, value) => {
    setLocalData((prev) => ({
      ...prev,
      hero_sections: {
        ...prev.hero_sections,
        donate: { ...prev.hero_sections.donate, [field]: value },
      },
    }));
  }, []);

  const updateDonateImage = useCallback((index, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [
        ...prev.filter((img) => img.key !== `donate_${index}`),
        { field: `images[${index}]`, key: `donate_${index}`, file, blobUrl },
      ]);
      setLocalData((prev) => {
        const newImages = [...(prev.hero_sections.donate.images || ["", ""])];
        newImages[index] = blobUrl;
        return {
          ...prev,
          hero_sections: {
            ...prev.hero_sections,
            donate: { ...prev.hero_sections.donate, images: newImages },
          },
        };
      });
    }
  }, []);

  const updateProjectField = useCallback((id, field, value) => {
    const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
    const dateValue = field === "started_time" && value && isValidDate(value) ? value : value;
    setLocalData((prev) => ({
      ...prev,
      project_overviews: {
        ...prev.project_overviews,
        [id]: {
          ...prev.project_overviews[id] || {
            title: "",
            abstract: "",
            thumbnail: { src: "", alt: "", caption: "" },
            started_time: null,
          },
          [field === "description" ? "abstract" : field]: dateValue,
          thumbnail: {
            ...prev.project_overviews[id]?.thumbnail || { src: "", alt: "", caption: "" },
            title: field === "title" ? value : prev.project_overviews[id]?.title || "",
          },
        },
      },
    }));
  }, []);

  const updateProjectImage = useCallback((id, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [
        ...prev.filter((img) => img.key !== `project_${id}`),
        { field: "thumbnail.src", key: `project_${id}`, file, blobUrl },
      ]);
      setLocalData((prev) => ({
        ...prev,
        project_overviews: {
          ...prev.project_overviews,
          [id]: {
            ...prev.project_overviews[id] || {
              title: "",
              abstract: "",
              thumbnail: { src: "", alt: "", caption: "" },
              started_time: null,
            },
            thumbnail: {
              ...prev.project_overviews[id]?.thumbnail || { src: "", alt: "", caption: "" },
              src: blobUrl,
            },
          },
        },
      }));
    }
  }, []);

  const updateEventsField = useCallback((id, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      event_overviews: {
        ...prev.event_overviews,
        [id]: {
          ...prev.event_overviews[id] || {
            title: "",
            abstract: "",
            thumbnail: { src: "", alt: "", caption: "" },
          },
          [field === "description" ? "abstract" : field]: value,
          thumbnail: {
            ...prev.event_overviews[id]?.thumbnail || { src: "", alt: "", caption: "" },
            title: field === "title" ? value : prev.event_overviews[id]?.title || "",
          },
        },
      },
    }));
  }, []);

  const updateEventsImage = useCallback((id, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [
        ...prev.filter((img) => img.key !== `event_${id}`),
        { field: "thumbnail.src", key: `event_${id}`, file, blobUrl },
      ]);
      setLocalData((prev) => ({
        ...prev,
        event_overviews: {
          ...prev.event_overviews,
          [id]: {
            ...prev.event_overviews[id] || {
              title: "",
              abstract: "",
              thumbnail: { src: "", alt: "", caption: "" },
            },
            thumbnail: {
              ...prev.event_overviews[id]?.thumbnail || { src: "", alt: "", caption: "" },
              src: blobUrl,
            },
          },
        },
      }));
    }
  }, []);

  const createProject = useCallback(() => {
    const newId = `Dự Án_${Object.keys(localData.project_overviews).length}_${new Date().toISOString()}`;
    setLocalData((prev) => ({
      ...prev,
      project_overviews: {
        ...prev.project_overviews,
        [newId]: {
          title: "",
          abstract: "",
          thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
          started_time: null,
        },
      },
    }));
  }, [localData.project_overviews]);

  const removeProject = useCallback((id) => {
    setLocalData((prev) => ({
      ...prev,
      project_overviews: {
        ...Object.keys(prev.project_overviews)
          .filter((key) => key !== id)
          .reduce((acc, key) => ({ ...acc, [key]: prev.project_overviews[key] }), {}),
      },
    }));
    setPendingImages((prev) => prev.filter((img) => img.key !== `project_${id}`));
  }, []);

  const createEvent = useCallback(() => {
    const newId = `Sự Kiện_${Object.keys(localData.event_overviews).length}_${new Date().toISOString()}`;
    setLocalData((prev) => ({
      ...prev,
      event_overviews: {
        ...prev.event_overviews,
        [newId]: {
          title: "",
          abstract: "",
          thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
        },
      },
    }));
  }, [localData.event_overviews]);

  const removeEvent = useCallback((id) => {
    setLocalData((prev) => ({
      ...prev,
      event_overviews: {
        ...Object.keys(prev.event_overviews)
          .filter((key) => key !== id)
          .reduce((acc, key) => ({ ...acc, [key]: prev.event_overviews[key] }), {}),
      },
    }));
    setPendingImages((prev) => prev.filter((img) => img.key !== `event_${id}`));
  }, []);

  const saveChanges = async () => {
    try {
      // Upload pending images to Firebase Storage
      const imageUpdates = {};
      for (const { field, key, file } of pendingImages) {
        const storagePath =
          key === "hero_events"
            ? `hero/events/${file.name}`
            : key.startsWith("donate_")
            ? `hero/donate/${file.name}`
            : key.startsWith("project_")
            ? `projects/${file.name}`
            : `events/${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUpdates[key] = { field, url: downloadUrl };
        URL.revokeObjectURL(file); // Clean up Blob URL
      }

      // Apply image updates to localData
      const updatedMainData = { ...localData };
      Object.entries(imageUpdates).forEach(([key, { field, url }]) => {
        if (key === "hero_events") {
          updatedMainData.hero_sections.events[field] = url;
        } else if (key.startsWith("donate_")) {
          const index = parseInt(key.replace("donate_", ""), 10);
          updatedMainData.hero_sections.donate.images[index] = url;
        } else if (key.startsWith("project_")) {
          const id = key.replace("project_", "");
          updatedMainData.project_overviews[id].thumbnail.src = url;
        } else if (key.startsWith("event_")) {
          const id = key.replace("event_", "");
          updatedMainData.event_overviews[id].thumbnail.src = url;
        }
      });

      // Convert date strings to Firestore Timestamps for project_overviews
      updatedMainData.project_overviews = Object.entries(updatedMainData.project_overviews).reduce(
        (acc, [key, project]) => ({
          ...acc,
          [key]: {
            ...project,
            started_time:
              project.started_time && !isNaN(new Date(project.started_time).getTime())
                ? Timestamp.fromDate(new Date(project.started_time))
                : null,
          },
        }),
        {}
      );

      // Save to Firestore
      const docRef = doc(db, "Main pages", "components");
      await updateDoc(docRef, {
        hero_sections: updatedMainData.hero_sections,
        project_overviews: updatedMainData.project_overviews,
        event_overviews: updatedMainData.event_overviews,
      });

      // Update state
      setLocalData(updatedMainData);
      setPendingImages([]); // Clear pending images
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  const projectOverview = Object.keys(localData.project_overviews).length > 0
    ? {
        heading: "Tổng quan dự án",
        title: localData.project_overviews[Object.keys(localData.project_overviews)[0]].title || "",
        description: localData.project_overviews[Object.keys(localData.project_overviews)[0]].abstract || "",
        images: Object.values(localData.project_overviews).map(
          (project) => project.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png"
        ),
        started_time: localData.project_overviews[Object.keys(localData.project_overviews)[0]].started_time || "",
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
    title1: localData.hero_sections.donate.title1 || "Đặt mua bánh chưng",
    title2: localData.hero_sections.donate.title2 || "Ủng hộ hiện kim",
    images: localData.hero_sections.donate.images || [
      "https://blog.photobucket.com/hubfs/upload_pics_online.png",
      "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ],
  };

  const eventsOverview = {
    heading: "Tổng kết các sự kiện đã qua",
    events: Object.entries(localData.event_overviews).map(([key, event]) => ({
      id: key,
      title: event.title || "",
      imageUrl: event.thumbnail?.src || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    })),
  };

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        title={localData.hero_sections.events.title}
        description={localData.hero_sections.events.description}
        backgroundImage={localData.hero_sections.events.image}
        onFieldChange={updateHeroField}
        onImageUpload={updateHeroImage}
      />
      <div className="projects">
        <ProjectOverview
          pageData={projectOverview}
          onFieldChange={updateProjectField}
          onImageUpload={updateProjectImage}
          buttonColor={secondaryBackgroundColor}
        />
        <DonateOverview
          pageData={donateOverview}
          onFieldChange={updateDonateField}
          onImageUpload={updateDonateImage}
          buttonColor={secondaryBackgroundColor}
        />
        <ProjectLayout
          projects={localData.project_overviews}
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
      <SaveFloatingButton visible={true} onSave={saveChanges} />
    </div>
  );
}

export default Events;