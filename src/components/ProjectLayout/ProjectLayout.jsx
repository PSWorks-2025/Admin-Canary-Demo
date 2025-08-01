import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
import SectionWrap from "../SectionWrap";
import { useNavigate } from "react-router";
import { IoIosArrowForward } from "react-icons/io";

function ProjectLayout({ projects, setProjectOverviews, enqueueImageUpload, setHasChanges, buttonColor }) {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProjectLayout projects:", projects);
  }, [projects]);

  const handleAddProject = useCallback(() => {
    const newId = `project_${new Date().toISOString()}`;
    setProjectOverviews((prev) => ({
      ...prev,
      [newId]: {
        title: "",
        abstract: "",
        thumbnail: { src: "https://via.placeholder.com/300", alt: "", caption: "" },
        started_time: null,
      },
    }));
    setHasChanges(true);
  }, [setProjectOverviews, setHasChanges]);

  return (
    <SectionWrap className="py-10 w-full flex flex-col items-center" borderColor={buttonColor}>
      <h2 className="text-2xl md:text-[2.5rem] font-bold mb-4 text-primary-title text-center">
        Dự án & hoạt động nổi bật đã thực hiện
      </h2>
      <div className="w-full flex justify-center mb-4">
        <button
          onClick={handleAddProject}
          className="py-2 px-4 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title text-sm md:text-base"
        >
          Thêm dự án
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[1152px] mb-8 px-2 sm:px-4">
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
              navigate={navigate}
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
  navigate,
}) {
  const [localTitle, setLocalTitle] = useState(title || "");
  const [localStartedTime, setLocalStartedTime] = useState(started_time || "");

  useEffect(() => {
    console.log("ProjectListItem props updated:", { id, imageUrl, title, started_time, localTitle, localStartedTime });
  }, [id, imageUrl, title, started_time, localTitle, localStartedTime]);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`TextInput changed: ${field} = ${value}`);
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
      console.log("handleImageUpload called with file:", file);
      if (!file) {
        console.error("No file selected");
        return;
      }
      if (!(file instanceof File || file instanceof Blob)) {
        console.error("Invalid file type");
        return;
      }
      if (!file.type.startsWith("image/")) {
        console.error("Selected file is not an image");
        return;
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        console.error("File size exceeds 5MB");
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      console.log("Blob URL created:", blobUrl);
      const storagePath = `projects/${id}/${file.name}`;

      console.log("Enqueuing image upload:", { path: `main_pages.project_overviews.${id}.thumbnail.src`, storagePath });
      enqueueImageUpload(`main_pages.project_overviews.${id}.thumbnail.src`, storagePath, file);

      setProjectOverviews((prev) => {
        console.log("Updating projectOverviews with new image:", blobUrl);
        return {
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
              alt: prev[id]?.thumbnail?.alt || file.name,
            },
          },
        };
      });
      setHasChanges(true);
    },
    [id, enqueueImageUpload, setProjectOverviews, setHasChanges]
  );

  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        console.log("Revoking blob URL:", imageUrl);
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleDelete = useCallback(() => {
    setProjectOverviews((prev) => {
      const newProjects = Object.keys(prev)
        .filter((key) => key !== id)
        .reduce((acc, key) => ({ ...acc, [key]: prev[key] }), {});
      return newProjects;
    });
    setHasChanges(true);
  }, [id, setProjectOverviews, setHasChanges]);

  return (
    <div className="relative h-80 rounded-lg overflow-hidden shadow-md">
      <ImageInput
        handleImageUpload={(e) => {
          console.log("ImageInput onChange triggered");
          handleImageUpload(e.target.files[0]);
        }}
        top="top-2"
        left="left-2"
        section="project"
        className="relative w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl || "https://via.placeholder.com/300"})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />
        <button
          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full cursor-pointer z-15"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
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
        <div className="absolute bottom-0 z-20">
        <TextInput
          className="px-3 pb-3 ml-2 w-full text-sm md:text-base text-white font-semibold rounded outline-none z-20"
          value={localTitle}
          onChange={(e) => {
            handleChange("title", e.target.value);
          }}
          placeholder="Nhập tiêu đề dự án"
        />
        <TextInput
          type="date"
          className="px-3 pb-3 ml-2 text-sm md:text-base text-white font-semibold rounded outline-none z-20"
          value={localStartedTime}
          onChange={(e) => {
            handleChange("started_time", e.target.value);
          }}
          placeholder="Chọn ngày bắt đầu"
        />
        </div>
        <button
          className="absolute bottom-0 right-0 p-3 text-sm md:text-base text-white font-semibold z-20"
          onClick={(e) => {
            e.stopPropagation();
            navigate('/edit-content', {
              state: { id, title: localTitle, thumbnail: imageUrl },
            });
          }}
        >
          Chi tiết <IoIosArrowForward className="inline-block mb-0.5 ml-1 w-4 h-4 md:w-5 md:h-5" />
        </button>
      </ImageInput>
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
  navigate: PropTypes.func.isRequired,
};

export default ProjectLayout;