import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Timestamp } from "firebase/firestore"; // Added import
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function ProjectLayout({ projects, onChange, onImageUpload, addProject }) {
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedOnChange = debounce(onChange, 500);

  const handleChange = (id, field, value) => {
    debouncedOnChange(id, field, value);
  };

  return (
    <section className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        Dự án & hoạt động nổi bật đã thực hiện
      </h2>
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={addProject}
          className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
        >
          Thêm dự án
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-3/5 max-w-6xl mb-10">
        {Object.entries(projects)
          .map(([key, project]) => [key.slice(8), project])
          .sort((a, b) => a[0] - b[0])
          .map(([key, project]) => (
            <ProjectListItem
              key={`project_${key}`}
              id={`project_${key}`}
              title={project.title}
              imageUrl={project.thumbnail?.src || ""}
              started_time={project.started_time instanceof Timestamp 
                ? project.started_time.toDate().toISOString().split("T")[0] 
                : ""}
              onChange={handleChange}
              onImageUpload={onImageUpload}
            />
          ))}
      </div>
    </section>
  );
}

ProjectLayout.propTypes = {
  projects: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
};

function ProjectListItem({ id, title, imageUrl, started_time, onChange, onImageUpload }) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localStartedTime, setLocalStartedTime] = useState(started_time);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedOnChange = debounce(onChange, 500);

  const handleChange = (field, value) => {
    if (field === "title") setLocalTitle(value);
    else if (field === "started_time") setLocalStartedTime(value);
    debouncedOnChange(id, field, value);
  };

  return (
    <div className="relative h-96 rounded-lg overflow-hidden shadow-md">
      <div className="relative w-full h-full">
        {/* {imageUrl && (
          <img
            src={imageUrl}
            alt={title || "Project image"}
          />
        )} */}
           <ImageInput
          handleImageUpload={(file) => onImageUpload(id, file.target.files[0])}
          top="top-2"
          left="left-2"
          section="project"
            className="w-full h-full object-contain bg-cover bg-center"
          style={{backgroundImage:`url("${imageUrl || 'https://blog.photobucket.com/hubfs/upload_pics_online.png'}")`}}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
     
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
          onClick={() => onChange(id, "delete", null)}
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
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  started_time: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};

export default ProjectLayout;