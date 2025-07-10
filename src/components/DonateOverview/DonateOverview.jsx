import React from "react";
// import "./styles.css";

function DonateOverview({ pageData, handleFieldChange, handleImageUpload, imageInputRefs }) {
  return (
    <section className="px-8 py-8">
      <input
        className="w-full text-[2.5rem] font-bold text-black outline-none bg-transparent text-center mb-6"
        value={pageData.heading}
        onChange={(e) => handleFieldChange("heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="flex flex-row justify-center items-center gap-10 text-center">
        <div className="flex flex-col flex-1/3 items-center">
          <div
            className="w-full h-[40vh] bg-gray-600 bg-cover bg-center rounded-lg flex justify-center items-end pb-2 relative"
            style={{ backgroundImage: `url(${pageData.images[0] || "https://via.placeholder.com/800x400"})` }}
          >
            <input
              className="text-base font-semibold text-white outline-none bg-transparent"
              value={pageData.title1}
              onChange={(e) => handleFieldChange("title1", e.target.value)}
              placeholder="Nhập tiêu đề"
            />
            <button
              className="absolute top-2 left-2 p-2 bg-blue-500 text-white rounded-full cursor-pointer z-10"
              onClick={() => imageInputRefs[0].current.click()}
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
              ref={imageInputRefs[0]}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(0, e.target.files[0])}
            />
          </div>
          <button
            className="mt-2 text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200"
          >
            Mua ngay
          </button>
        </div>
        <div className="flex flex-col flex-1/3 items-center">
          <div
            className="w-full h-[40vh] bg-gray-600 bg-cover bg-center rounded-lg flex justify-center items-end pb-2 relative"
            style={{ backgroundImage: `url(${pageData.images[1] || "https://via.placeholder.com/800x400"})` }}
          >
            <input
              className="text-base font-semibold text-white outline-none bg-transparent"
              value={pageData.title2}
              onChange={(e) => handleFieldChange("title2", e.target.value)}
              placeholder="Nhập tiêu đề"
            />
            <button
              className="absolute top-2 left-2 p-2 bg-blue-500 text-white rounded-full cursor-pointer z-10"
              onClick={() => imageInputRefs[1].current.click()}
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
              ref={imageInputRefs[1]}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(1, e.target.files[0])}
            />
          </div>
          <button
            className="mt-2 text-white font-medium px-3 py-2 rounded-full bg-[#4160DF] hover:opacity-50 transition-opacity duration-200"
          >
            Ủng hộ
          </button>
        </div>
      </div>
    </section>
  );
}

export default DonateOverview;