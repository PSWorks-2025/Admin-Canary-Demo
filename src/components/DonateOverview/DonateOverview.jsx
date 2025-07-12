import React from "react";
// import "./styles.css";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function DonateOverview({ pageData, handleFieldChange, handleImageUpload, imageInputRefs,buttonColor }) {
  return (
    <section className="px-8 py-8">
      <TextInput
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
            <TextInput
              className="text-base font-semibold text-white outline-none bg-transparent"
              value={pageData.title1}
              onChange={(e) => handleFieldChange("title1", e.target.value)}
              placeholder="Nhập tiêu đề"
            />

            <ImageInput
              handleImageUpload={(file) => handleImageUpload(0, file.target.files[0])}
              top="top-2"
              left="left-2"
              section="donate_0"
            />

          </div>
          <button
            className="mt-2 text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
            style={{backgroundColor:buttonColor}}
          >
            Mua ngay
          </button>
        </div>
        <div className="flex flex-col flex-1/3 items-center">
          <div
            className="w-full h-[40vh] bg-gray-600 bg-cover bg-center rounded-lg flex justify-center items-end pb-2 relative"
            style={{ backgroundImage: `url(${pageData.images[1] || "https://via.placeholder.com/800x400"})` }}
          >
            <TextInput
              className="text-base font-semibold text-white outline-none bg-transparent"
              value={pageData.title2}
              onChange={(e) => handleFieldChange("title2", e.target.value)}
              placeholder="Nhập tiêu đề"
            />

            <ImageInput
              handleImageUpload={(file) => handleImageUpload(1, file.target.files[0])}
              top="top-2"
              left="left-2"
              section="donate_1"
            />
          </div>
          <button
            className="mt-2 text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
            style={{backgroundColor:buttonColor}}
          >
            Ủng hộ
          </button>
        </div>
      </div>
    </section>
  );
}

export default DonateOverview;