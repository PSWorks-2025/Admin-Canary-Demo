import { useRef } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
function ProjectLayout({ projects, onChange, onImageUpload, addProject }) {
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
              imageUrl={project.imageUrl}
              onChange={onChange}
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

export default ProjectLayout;

function ProjectListItem({ id, title, imageUrl, onChange, onImageUpload }) {

  return (
    <div className="relative h-96 rounded-lg overflow-hidden shadow-md">
      <div className="relative w-full h-full">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title || "Project image"}
            className="w-full h-full object-contain"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"></div>
        <ImageInput
          handleImageUpload={(file) => onImageUpload(id, file.target.files[0])}
          top="top-2"
          left="left-2"
          section="project"
        />
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
          value={title}
          onChange={(e) => onChange(id, "title", e.target.value)}
          placeholder="Nhập tiêu đề dự án"
        />
      </div>
    </div>
  );
}

ProjectListItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};