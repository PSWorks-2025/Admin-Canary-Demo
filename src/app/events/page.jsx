import React, { useRef, useContext } from "react";
import HeroSection from "./EventsSection/HeroSection";
import DonateOverview from "../../components/DonateOverview/DonateOverview";
import ProjectOverview from "../../components/projectOverview/ProjectOverview";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import EventsOverview from "../../components/EventsOverview/EventsOverview";
import "./styles.css";
import { ColorContext } from "../../layout";
import { db, storage } from "../../service/firebaseConfig.jsx";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Events() {
  const { primaryBackgroundColor, secondaryBackgroundColor, tertiaryBackgroundColor, mainData, setMainData } = useContext(ColorContext);

  const updateMainData = async (updates) => {
    setMainData((prevMainData) => {
      const newMainData = { ...prevMainData, ...updates };
      try {
        const docRef = doc(db, "Main pages", "components");
        updateDoc(docRef, newMainData);
      } catch (error) {
        console.error("Error updating mainData:", error);
      }
      return newMainData;
    });
  };

  const handleFieldChange = async (field, value) => {
    if (!value.trim()) return;
    updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        events: { ...mainData.hero_sections.events, [field]: value },
      },
    });
  };

  const handleImageUpload = async (file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/events/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          hero_sections: {
            ...mainData.hero_sections,
            events: { ...mainData.hero_sections.events, image: downloadUrl },
          },
        });
      } catch (error) {
        console.error("Error uploading hero image:", error);
      }
    } else {
      console.error("Invalid file for hero image:", file);
    }
  };

  const handleProjectFieldChange = async (field, value) => {
    if (!value.trim()) return;
    const projectKey = Object.keys(mainData.project_overviews)[0] || `Dự Án_0_${new Date().toISOString()}`;
    updateMainData({
      project_overviews: {
        ...mainData.project_overviews,
        [projectKey]: {
          ...mainData.project_overviews[projectKey],
          [field === "description" ? "abstract" : field]: value,
          thumbnail: {
            ...mainData.project_overviews[projectKey]?.thumbnail,
            title: field === "title" ? value : mainData.project_overviews[projectKey]?.title,
          },
        },
      },
    });
  };

  const handleProjectImageUpload = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `projects/overview/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        const projectKey = Object.keys(mainData.project_overviews)[0] || `Dự Án_0_${new Date().toISOString()}`;
        updateMainData({
          project_overviews: {
            ...mainData.project_overviews,
            [projectKey]: {
              ...mainData.project_overviews[projectKey],
              thumbnail: {
                ...mainData.project_overviews[projectKey]?.thumbnail,
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading project overview image ${index}:`, error);
      }
    } else {
      console.error(`Invalid file for project overview image ${index}:`, file);
    }
  };

  const handleDonateFieldChange = async (field, value) => {
    if (!value.trim()) return;
    updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        donate: { ...mainData.hero_sections.donate, [field]: value },
      },
    });
  };

  const handleDonateImageUpload = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/donate/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          hero_sections: {
            ...mainData.hero_sections,
            donate: { ...mainData.hero_sections.donate, image: downloadUrl },
          },
        });
      } catch (error) {
        console.error(`Error uploading donate image ${index}:`, error);
      }
    } else {
      console.error(`Invalid file for donate image ${index}:`, file);
    }
  };

  const handleEventsFieldChange = async (index, field, value) => {
    if (!value.trim()) return;
    const eventKeys = Object.keys(mainData.event_overviews);
    const eventKey = eventKeys[index] || `Sự Kiện_${index}_${new Date().toISOString()}`;
    updateMainData({
      event_overviews: {
        ...mainData.event_overviews,
        [eventKey]: {
          ...mainData.event_overviews[eventKey],
          [field === "title" ? "title" : "abstract"]: value,
          thumbnail: {
            ...mainData.event_overviews[eventKey]?.thumbnail,
            title: field === "title" ? value : mainData.event_overviews[eventKey]?.title,
          },
        },
      },
    });
  };

  const handleEventsImageUpload = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `events/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        const eventKeys = Object.keys(mainData.event_overviews);
        const eventKey = eventKeys[index] || `Sự Kiện_${index}_${new Date().toISOString()}`;
        updateMainData({
          event_overviews: {
            ...mainData.event_overviews,
            [eventKey]: {
              ...mainData.event_overviews[eventKey],
              thumbnail: {
                ...mainData.event_overviews[eventKey]?.thumbnail,
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading event image ${index}:`, error);
      }
    } else {
      console.error(`Invalid file for event image ${index}:`, file);
    }
  };

  const handleProjectChange = async (id, field, value) => {
    if (field === "delete") {
      updateMainData({
        project_overviews: {
          ...Object.keys(mainData.project_overviews)
            .filter((key) => key !== id)
            .reduce((acc, key) => ({ ...acc, [key]: mainData.project_overviews[key] }), {}),
        },
      });
    } else if (!value.trim()) {
      return;
    } else {
      updateMainData({
        project_overviews: {
          ...mainData.project_overviews,
          [id]: {
            ...mainData.project_overviews[id],
            [field === "title" ? "title" : "abstract"]: value,
            thumbnail: {
              ...mainData.project_overviews[id]?.thumbnail,
              title: field === "title" ? value : mainData.project_overviews[id]?.title,
            },
          },
        },
      });
    }
  };

  const handleProjectLayoutImageUpload = async (id, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `projects/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
          project_overviews: {
            ...mainData.project_overviews,
            [id]: {
              ...mainData.project_overviews[id],
              thumbnail: {
                ...mainData.project_overviews[id]?.thumbnail,
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading project image ${id}:`, error);
      }
    } else {
      console.error(`Invalid file for project image ${id}:`, file);
    }
  };

  const addProject = async () => {
    const newId = `Dự Án_${Object.keys(mainData.project_overviews).length}_${new Date().toISOString()}`;
    updateMainData({
      project_overviews: {
        ...mainData.project_overviews,
        [newId]: {
          title: "",
          abstract: "",
          thumbnail: { src: "", alt: "", caption: "" },
          started_time: new Date(),
        },
      },
    });
  };

  const deleteProject = async (id) => {
    updateMainData({
      project_overviews: {
        ...Object.keys(mainData.project_overviews)
          .filter((key) => key !== id)
          .reduce((acc, key) => ({ ...acc, [key]: mainData.project_overviews[key] }), {}),
      },
    });
  };

  // Use first project for ProjectOverview
  const projectOverview = Object.entries(mainData.project_overviews)[0]
    ? {
        heading: "Tổng quan dự án",
        title: mainData.project_overviews[Object.keys(mainData.project_overviews)[0]].title,
        description: mainData.project_overviews[Object.keys(mainData.project_overviews)[0]].abstract,
        images: [mainData.project_overviews[Object.keys(mainData.project_overviews)[0]].thumbnail.src, "", "", "", ""],
      }
    : {
        heading: "Tổng quan dự án",
        title: "",
        description: "",
        images: ["", "", "", "", ""],
      };

  // Use hero_sections.donate for DonateOverview
  const donateOverview = {
    heading: "Hãy đồng hành cùng chúng mình",
    title1: mainData.hero_sections.donate.title1 || "Đặt mua bánh chưng",
    title2: mainData.hero_sections.donate.title2 || "Ủng hộ hiện kim",
    images: [mainData.hero_sections.donate.image, ""],
  };

  // Use event_overviews for EventsOverview
  const eventsOverview = {
    heading: "Tổng kết các sự kiện đã qua",
    events: Object.entries(mainData.event_overviews).map(([key, event], index) => ({
      title: event.title,
      imageUrl: event.thumbnail.src,
    })),
  };

  // Limit refs to one for ProjectOverview and DonateOverview (single image each)
  const projectImageInputRefs = [useRef(null)];
  const donateImageInputRefs = [useRef(null)];
  const eventsImageInputRefs = Object.keys(mainData.event_overviews).map(() => useRef(null));

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        title={mainData.hero_sections.events.title}
        description={mainData.hero_sections.events.description}
        backgroundImage={mainData.hero_sections.events.image}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
      />
      <div className="border-b-black border-b-3"></div>
      <div className="projects">
        <ProjectOverview
          pageData={projectOverview}
          handleFieldChange={handleProjectFieldChange}
          handleImageUpload={handleProjectImageUpload}
          buttonColor={secondaryBackgroundColor}
        />
        <div className="border-b-black border-b-3"></div>
        <DonateOverview
          pageData={donateOverview}
          handleFieldChange={handleDonateFieldChange}
          handleImageUpload={handleDonateImageUpload}
          buttonColor={secondaryBackgroundColor}
        />
        <div className="border-b-black border-b-3"></div>
        <ProjectLayout
          projects={mainData.project_overviews}
          onChange={handleProjectChange}
          onImageUpload={handleProjectLayoutImageUpload}
          addProject={addProject}
          deleteProject={deleteProject}
        />
        <div className="border-b-black border-b-3"></div>
        <EventsOverview
          pageData={eventsOverview}
          handleFieldChange={handleEventsFieldChange}
          handleImageUpload={handleEventsImageUpload}
          imageInputRefs={eventsImageInputRefs}
        />
      </div>
    </div>
  );
}

export default Events;