import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdCircle } from "react-icons/md";
import { useState, useRef } from "react";
import PropTypes from "prop-types";

export function ScrollStoryListItem({ id, imageUrl, title, description, onChange, onImageUpload }) {
  const fileInputRef = useRef(null);

  return (
    <div className="w-88 mr-8 h-full">
      <div className="relative">
        <div
          className="w-full h-60 bg-cover bg-center rounded-sm"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        ></div>
        <button
          className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
          onClick={() => fileInputRef.current.click()}
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
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
            />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => onImageUpload(id, e.target.files[0])}
        />
      </div>
      <input
        className="w-full font-bold text-2xl pt-5 text-primary-title outline-none"
        value={title}
        onChange={(e) => onChange(id, "title", e.target.value)}
        placeholder="Nhập tiêu đề câu chuyện"
      />
      <textarea
        className="w-full text-base/5 py-5 text-primary-paragraph outline-none resize-none"
        value={description}
        onChange={(e) => onChange(id, "description", e.target.value)}
        placeholder="Nhập mô tả câu chuyện"
        rows="4"
      ></textarea>
      
      <button className="text-secondary font-semibold block mt-2">
        Đọc thêm
        <IoIosArrowForward className="inline-block mb-0.5 ml-1" />
      </button>
    </div>
  );
}

ScrollStoryListItem.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};

export function ScrollStoryList({ children }) {
  const numberOfPages = Math.ceil(children.length / 3);

  const [page, setPage] = useState(0);

  return (
    <div className="w-full pt-12 flex justify-center">
      <div className="w-280 h-112 relative">
        <button
          onClick={() => setPage(Math.max(page - 1, 0))}
          className="w-11 h-11 absolute -left-6 top-54 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer z-10"
        >
          <IoIosArrowBack className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPage(Math.min(page + 1, numberOfPages - 1))}
          className="w-11 h-11 absolute -right-6 top-54 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer z-10"
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

ScrollStoryList.propTypes = {
  children: PropTypes.array,
};