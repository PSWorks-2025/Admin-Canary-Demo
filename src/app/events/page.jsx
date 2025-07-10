import React, { useState, useRef } from "react";
import HeroSection from "./EventsSection/HeroSection";
import DonateOverview from "../../components/DonateOverview/DonateOverview";
import ProjectOverview from "../../components/projectOverview/ProjectOverview";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import EventsOverview from "../../components/EventsOverview/EventsOverview";
import "./styles.css";
import canary5 from "/images/canary5.jpg";

function Events() {
  const [pageData, setPageData] = useState({
    title: "Tên sự kiện",
    description:
      "Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget aliquet gravida ac nisl vitae quis.",
    backgroundImage: canary5,
    projectOverview: {
      heading: "Tổng quan dự án",
      title: "Tên dự án",
      description:
        "Lorem ipsum dolor sit amet consectetur. Mi eget scelerisque interdum cursus leo nibh sit. Diam tellus ornare tortor cursus vestibulum facilisis ac. Turpis sed magnis placerat semper mauris in diam. Eget aliquet gravida ac nisl vitae quis.",
      images: ["", "", "", "", ""],
    },
    donateOverview: {
      heading: "Hãy đồng hành cùng chúng mình",
      title1: "Đặt mua bánh chưng",
      title2: "Ủng hộ hiện kim",
      images: ["", ""],
    },
    projects: {
      project_0: { title: "Tên dự án 1", imageUrl: canary5 },
      project_1: { title: "Tên dự án 2", imageUrl: canary5 },
      project_2: { title: "Tên dự án 3", imageUrl: canary5 },
      project_3: { title: "Tên dự án 4", imageUrl: canary5 },
    },
    eventsOverview: {
      heading: "Tổng kết các sự kiện đã qua",
      events: [
        { title: "Tên sự kiện 1", imageUrl: "" },
        { title: "Tên sự kiện 2", imageUrl: "" },
        { title: "Tên sự kiện 3", imageUrl: "" },
        { title: "Tên sự kiện 4", imageUrl: "" },
        { title: "Tên sự kiện 5", imageUrl: "" },
      ],
    },
  });

  const imageInputRef = useRef(null);
  const projectImageInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const donateImageInputRefs = [useRef(null), useRef(null)];
  const eventsImageInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleFieldChange = (field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleProjectFieldChange = (field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      projectOverview: {
        ...prevData.projectOverview,
        [field]: value,
      },
    }));
  };

  const handleDonateFieldChange = (field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      donateOverview: {
        ...prevData.donateOverview,
        [field]: value,
      },
    }));
  };

  const handleEventsFieldChange = (index, field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      eventsOverview: {
        ...prevData.eventsOverview,
        events: prevData.eventsOverview.events.map((event, i) =>
          i === index ? { ...event, [field]: value } : event
        ),
      },
    }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          backgroundImage: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          projectOverview: {
            ...prevData.projectOverview,
            images: prevData.projectOverview.images.map((img, i) =>
              i === index ? e.target.result : img
            ),
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDonateImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          donateOverview: {
            ...prevData.donateOverview,
            images: prevData.donateOverview.images.map((img, i) =>
              i === index ? e.target.result : img
            ),
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEventsImageUpload = (index, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          eventsOverview: {
            ...prevData.eventsOverview,
            events: prevData.eventsOverview.events.map((event, i) =>
              i === index ? { ...event, imageUrl: e.target.result } : event
            ),
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProjectChange = (id, field, value) => {
    if (field === "delete") {
      setPageData((prevData) => {
        const { [id]: _, ...rest } = prevData.projects;
        return { ...prevData, projects: rest };
      });
    } else {
      setPageData((prevData) => ({
        ...prevData,
        projects: {
          ...prevData.projects,
          [id]: {
            ...prevData.projects[id],
            [field]: value,
          },
        },
      }));
    }
  };

  const handleProjectLayoutImageUpload = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          projects: {
            ...prevData.projects,
            [id]: {
              ...prevData.projects[id],
              imageUrl: e.target.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addProject = () => {
    const newId = `project_${Object.keys(pageData.projects).length}`;
    setPageData((prevData) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        [newId]: { title: "", imageUrl: "" },
      },
    }));
  };

  const deleteProject = (id) => {
    setPageData((prevData) => {
      const { [id]: _, ...rest } = prevData.projects;
      return { ...prevData, projects: rest };
    });
  };

  return (
    <>
      <HeroSection
        title={pageData.title}
        description={pageData.description}
        backgroundImage={pageData.backgroundImage}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
        imageInputRef={imageInputRef}
      />
      <div className="projects">
        <ProjectOverview
          pageData={pageData.projectOverview}
          handleFieldChange={handleProjectFieldChange}
          handleImageUpload={handleProjectImageUpload}
          imageInputRefs={projectImageInputRefs}
        />
        <DonateOverview
          pageData={pageData.donateOverview}
          handleFieldChange={handleDonateFieldChange}
          handleImageUpload={handleDonateImageUpload}
          imageInputRefs={donateImageInputRefs}
        />
        <ProjectLayout
          projects={pageData.projects}
          onChange={handleProjectChange}
          onImageUpload={handleProjectLayoutImageUpload}
          addProject={addProject}
          deleteProject={deleteProject}
        />
        <EventsOverview
          pageData={pageData.eventsOverview}
          handleFieldChange={handleEventsFieldChange}
          handleImageUpload={handleEventsImageUpload}
          imageInputRefs={eventsImageInputRefs}
        />
      </div>
    </>
  );
}

export default Events;