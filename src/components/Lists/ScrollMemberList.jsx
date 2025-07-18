import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdCircle } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
import React from "react";

export function ScrollMemberListItem({ index, imageUrl, name, role, onChange, onImageUpload, onDelete }) {
  return (
    <div className="w-64 mr-8 h-full relative flex-shrink-0">
      <div className="relative">
        
        <ImageInput
          handleImageUpload={(e) => onImageUpload(e.target.files[0])}
          top="top-2"
          left="left-2"
          style={{ backgroundImage: `url("${imageUrl|| 'https://blog.photobucket.com/hubfs/upload_pics_online.png'}")` }}
          className="w-full h-64 bg-cover bg-center rounded-sm"
        />
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
          onClick={onDelete}
          aria-label={`Delete member ${name || "unknown"}`}
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
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Nhập tên thành viên"
      />
      <TextInput
        className="w-full text-base/5 text-primary-paragraph text-center outline-none bg-transparent"
        value={role}
        onChange={(e) => onChange("role", e.target.value)}
        placeholder="Nhập chức vụ"
      />
    </div>
  );
}

ScrollMemberListItem.propTypes = {
  index: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export function ScrollMemberList({ children }) {
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Dynamically calculate items per page based on screen width
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerPage(2); // Mobile: 2 item per page
      } else if (width < 1024) {
        setItemsPerPage(3); // Tablet: 3 items per page
      } else {
        setItemsPerPage(5); // Desktop: 5 items per page
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const numberOfPages = Math.ceil(React.Children.count(children) / itemsPerPage);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, numberOfPages - 1));

  return (
    <div className="w-full pt-12 flex  justify-center">
      <div className="w-full max-w-7xl relative px-6">
        <button
          onClick={handlePrev}
          className={`w-11 h-11 absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer ${
            page === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={page === 0}
          aria-label="Previous members"
        >
          <IoIosArrowBack className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className={`w-11 h-11 absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-primary-darken flex justify-center items-center cursor-pointer ${
            page >= numberOfPages - 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={page >= numberOfPages - 1}
          aria-label="Next members"
        >
          <IoIosArrowForward className="w-5 h-5" />
        </button>
        <div className="w-full overflow-hidden" ref={containerRef}>
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${page * (100 / itemsPerPage)}%)` }}
          >
            {React.Children.map(children, (child, index) =>
              React.cloneElement(child, { index })
            )}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          {Array.from({ length: numberOfPages }, (_, index) => (
            <MdCircle
              key={`dot_${index}`}
              className={`w-2.5 h-2.5 mx-0.5 cursor-pointer ${
                page === index ? "text-secondary" : "text-primary-darken-2"
              }`}
              onClick={() => setPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

ScrollMemberList.propTypes = {
  children: PropTypes.node,
};