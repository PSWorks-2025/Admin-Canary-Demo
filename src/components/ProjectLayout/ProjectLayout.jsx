import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
import SectionWrap from "../SectionWrap";

function ProjectLayout({ projects, setProjectOverviews, enqueueImageUpload, setHasChanges, buttonColor }) {
  const handleAddProject = useCallback(() => {
    console.log("ProjectLayout: Adding new project");
    const newId = `Dự Án_${Object.keys(projects).length}_${new Date().toISOString()}`;
    setProjectOverviews((prev) => ({
      ...prev,
      [newId]: {
        title: "",
        abstract: "",
        thumbnail: { src: "https://blog.photobucket.com/hubfs/upload_pics_online.png", alt: "", caption: "" },
        started_time: null,
      },
    }));
    setHasChanges(true);
  }, [projects, setProjectOverviews, setHasChanges]);

  return (
    <SectionWrap className="w-full flex flex-col items-center" borderColor={buttonColor}>
      <h2 className="text-2xl font-bold mb-4">Dự án & hoạt động nổi bật đã thực hiện</h2>
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={handleAddProject}
          className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
        >
          Thêm dự án
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-3/5 max-w-6xl mb-10">
        {Object.entries(projects)
          .map(([key, project]) => [key, project])
          .sort((a, b) => a[0].slice(8) - b[0].slice(8))
          .map(([key, project]) => (
            <ProjectListItem
              key={`project_${key}`}
              id={key}
              title={project.title}
              imageUrl={project.thumbnail?.src}
              started_time={project.started_time || ""}
              setProjectOverviews={setProjectOverviews}
              enqueueImageUpload={enqueueImageUpload}
              setHasChanges={setHasChanges}
            />
          ))}
      </div>
    </SectionWrap>
  );
}

ProjectLayout.propTypes = {
  projects: PropTypes.object.isRequired,
  setProjectOverviews: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
};

function ProjectListItem({
  id,
  title,
  imageUrl,
  started_time,
  setProjectOverviews,
  enqueueImageUpload,
  setHasChanges,
}) {
  const [localTitle, setLocalTitle] = useState(title || "");
  const [localStartedTime, setLocalStartedTime] = useState(started_time || "");

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`ProjectListItem[${id}]: Updating ${field} to ${value}`);
      const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
      const dateValue = field === "started_time" && value && isValidDate(value) ? value : value;
      const debouncedUpdate = debounce((field, value) => {
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
        setHasChanges(true);
      }, 500);
      if (field === "title") setLocalTitle(value);
      else if (field === "started_time") setLocalStartedTime(value);
      debouncedUpdate(field, value);
    },
    [id, setProjectOverviews, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`ProjectListItem[${id}]: Enqueuing image for thumbnail.src`);
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
        setHasChanges(true);
      } else {
        console.error(`ProjectListItem[${id}]: Invalid file for thumbnail.src:`, file);
      }
    },
    [id, enqueueImageUpload, setProjectOverviews, setHasChanges]
  );

  const handleDelete = useCallback(() => {
    console.log(`ProjectListItem[${id}]: Deleting project`);
    setProjectOverviews((prev) => {
      const newProjects = Object.keys(prev)
        .filter((key) => key !== id)
        .reduce((acc, key) => ({ ...acc, [key]: prev[key] }), {});
      return newProjects;
    });
    setHasChanges(true);
  }, [id, setProjectOverviews, setHasChanges]);

  return (
    <div className="relative h-96 rounded-lg overflow-hidden shadow-md">
      <div className="relative w-full h-full">
        <ImageInput
          handleImageUpload={(e) => handleImageUpload(e.target.files[0])}
          top="top-2"
          left="left-2"
          section="project"
          className="w-full h-full object-contain bg-cover bg-center"
          style={{ backgroundImage: `url("${imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
          onClick={handleDelete}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <TextInput
          className="absolute bottom-0 left-0 p-4 w-full text-white font-semibold outline-none bg-transparent z-10"
          value={localTitle}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Nhập tiêu đề dự án"
        />
        <TextInput
          type="date"
          className="absolute bottom-10 left-0 p-4 w-full text-white outline-none bg-transparent z-10"
          value={localStartedTime}
          onChange={(e) => handleChange("started_time", e.target.value)}
          placeholder="Chọn ngày bắt đầu"
        />
      </div>
    </div>
  );
}

ProjectListItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  started_time: PropTypes.string,
  setProjectOverviews: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
};

export default ProjectLayout;