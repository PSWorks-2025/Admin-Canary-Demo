import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdCircle } from "react-icons/md";
import { useState } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

export function ScrollMemberListItem({ id, imageUrl, name, role, onChange, onImageUpload, onDelete }) {
  
  return (
    <div className="w-64 mr-8 h-full relative">
      <div className="relative">
        <div
          className="w-full h-64 bg-cover bg-center rounded-sm"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        ></div>
        <ImageInput
          handleImageUpload={(file) => onImageUpload(id, file.target.files[0])}
          top="top-2"
          left="left-2"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
          onClick={() => onDelete(id)}
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
      </div>
      <TextInput
        className="w-full font-bold text-lg pt-2 text-primary-title text-center outline-none bg-transparent"
        value={name}
        onChange={(e) => onChange(id, "name", e.target.value)}
        placeholder="Nhập tên thành viên"
      />
      <TextInput
        className="w-full text-base/5 text-primary-paragraph text-center outline-none bg-transparent"
        value={role}
        onChange={(e) => onChange(id, "role", e.target.value)}
        placeholder="Nhập chức vụ"
      />
    </div>
  );
}

ScrollMemberListItem.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired, // Add onDelete to PropTypes
};

export function ScrollMemberList({ children }) {
  const numberOfPages = Math.ceil(children.length / 4);
  const [page, setPage] = useState(0);

  return (
    <div className="w-full pt-12 flex justify-center">
      <div className="w-280 h-88 relative">
        <button
          onClick={() => setPage(Math.max(page - 1, 0))}
          className="w-11 h-11 absolute -left-6 z-10 top-27 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer"
        >
          <IoIosArrowBack className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPage(Math.min(page + 1, numberOfPages - 1))}
          className="w-11 h-11 absolute -right-6 top-27 z-10 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer"
        >
          <IoIosArrowForward className="w-5 h-5" />
        </button>
        <div className="w-full h-full overflow-hidden">
          <div
            className="w-100000 h-full flex transition-all duration-750"
            style={{ marginLeft: `calc(${-288 * page} * var(--spacing))` }}
          >
            {children}
          </div>
        </div>
        <div className="absolute bottom-0 w-full flex justify-center">
          {Array.from(Array(numberOfPages).keys()).map((index) => (
            <MdCircle
              key={`dot_${index}`}
              className={`w-2.5 h-2.5 mx-0.5
                ${page === index ? "text-secondary" : "text-primary-darken-2"}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollMemberList.propTypes = {
  children: PropTypes.array,
};