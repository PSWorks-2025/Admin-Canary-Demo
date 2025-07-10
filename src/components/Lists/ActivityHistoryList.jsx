import { MdCircle } from "react-icons/md";
import { BiSolidRightArrow } from "react-icons/bi";
import PropTypes from "prop-types";
import { useRef } from "react";

export function ActivityHistoryList({ children }) {
  return (
    <div className="w-full">
      {children.map((activity, index) => (
        <div
          key={`activity_${index}`}
          className={`w-full ${index % 2 === 1 ? "flex flex-row-reverse" : "flex"}`}
        >
          {activity}
        </div>
      ))}
    </div>
  );
}

ActivityHistoryList.propTypes = {
  children: PropTypes.array,
};

export function ActivityHistoryListItem({
  id,
  startDate,
  endDate,
  imageUrl1,
  imageUrl2,
  description,
  onChange,
  onImageUpload,
}) {
  const image1Ref = useRef(null);
  const image2Ref = useRef(null);

  return (
    <div className="relative">
      <div className="w-full h-84 mt-12 md:mt-8 flex">
        <div className="w-1/2 h-full px-4">
          <div className="w-136 h-full float-right relative">
            <div
              className="absolute w-88 h-62 bg-cover bg-center rounded-lg top-0 left-0"
              style={{ backgroundImage: `url("${imageUrl1}")` }}
            >
              <button
                className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
                onClick={() => image1Ref.current.click()}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref={image1Ref}
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(id, "imageUrl1", e.target.files[0])}
              />
            </div>
            <div
              className="absolute w-88 h-47 bg-cover bg-center rounded-lg bottom-0 right-0"
              style={{ backgroundImage: `url("${imageUrl2}")` }}
            >
              <button
                className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
                onClick={() => image2Ref.current.click()}
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
                  />
                </svg>
              </button>
              <input
                type="file"
                ref={image2Ref}
                accept="image/*"
                className="hidden"
                onChange={(e) => onImageUpload(id, "imageUrl2", e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="w-1/2 h-full px-4">
          <div className="w-136 h-full">
            <div className="w-83 flex justify-between text-[1.6rem] font-bold text-primary-title">
              <input
                className="w-1/2 text-[1.6rem] font-bold text-primary-title outline-none bg-transparent"
                value={startDate}
                onChange={(e) => onChange(id, "startDate", e.target.value)}
                placeholder="Nhập ngày bắt đầu"
              />
              <input
                className="w-1/2 text-[1.6rem] font-bold text-primary-title outline-none bg-transparent text-right"
                value={endDate}
                onChange={(e) => onChange(id, "endDate", e.target.value)}
                placeholder="Nhập ngày kết thúc"
              />
            </div>
            <div className="flex items-center py-2">
              <MdCircle className="w-5 h-5 mr-0.5 text-secondary" />
              <div className="w-72 h-0.75 rounded-full bg-secondary"></div>
              <BiSolidRightArrow className="w-3.5 h-3.5 -ml-1 text-secondary" />
              <MdCircle className="w-5 h-5 mx-0.5 text-secondary" />
              <div className="w-20 h-0.75 rounded-full bg-secondary"></div>
            </div>
            <textarea
              className="w-136 text-base/5 pt-2 text-primary-paragraph outline-none bg-transparent resize-none"
              value={description}
              onChange={(e) => onChange(id, "description", e.target.value)}
              placeholder="Nhập mô tả hoạt động"
              rows="4"
            />
          </div>
        </div>
      </div>
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
    </div>
  );
}

ActivityHistoryListItem.propTypes = {
  id: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  imageUrl1: PropTypes.string.isRequired,
  imageUrl2: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
};