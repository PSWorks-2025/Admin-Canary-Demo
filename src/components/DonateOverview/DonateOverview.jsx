import React, { useState } from "react";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function DonateOverview({ pageData, handleFieldChange, handleImageUpload, buttonColor }) {
  const [localHeading, setLocalHeading] = useState(pageData.heading);
  const [localTitle1, setLocalTitle1] = useState(pageData.title1);
  const [localTitle2, setLocalTitle2] = useState(pageData.title2);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleFieldChange = debounce(handleFieldChange, 500);

  const handleChange = (field, value) => {
    if (field === "heading") setLocalHeading(value);
    else if (field === "title1") setLocalTitle1(value);
    else setLocalTitle2(value);
    debouncedHandleFieldChange(field, value);
  };

 return (
  <section className="px-8 py-8">
    <TextInput
      className="w-full text-[2.5rem] font-bold text-black outline-none bg-transparent text-center mb-6"
      value={localHeading}
      onChange={(e) => handleChange("heading", e.target.value)}
      placeholder="Nhập tiêu đề phần"
    />
    <div className="flex flex-row justify-center items-start gap-10 text-center">
      <div className="flex flex-col flex-1 items-center">
        <div className="w-full h-[40vh] bg-gray-600 relative flex flex-col justify-end">
          <TextInput
            className="text-base font-semibold text-white outline-none bg-transparent mb-2"
            value={localTitle1}
            onChange={(e) => handleChange("title1", e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <ImageInput
            handleImageUpload={(file) => handleImageUpload(0, file.target.files[0])}
            className="bg-cover bg-center rounded-lg flex justify-center items-center"
            style={{ backgroundImage: `url(${pageData.images[0] || "https://via.placeholder.com/800x400"})`, height: '100%', width: '100%' }}
            section="donate_0"
          />
        </div>
        <button
          className="mt-2 text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
          style={{ backgroundColor: buttonColor }}
        >
          Mua ngay
        </button>
      </div>
      <div className="flex flex-col flex-1 items-center">
        <div className="w-full h-[40vh] bg-gray-600 relative flex flex-col justify-end">
          <TextInput
            className="text-base font-semibold text-white outline-none bg-transparent mb-2"
            value={localTitle2}
            onChange={(e) => handleChange("title2", e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <ImageInput
            handleImageUpload={(file) => handleImageUpload(1, file.target.files[0])}
            className="bg-cover bg-center rounded-lg flex justify-center items-center"
            style={{ backgroundImage: `url(${pageData.images[1] || "https://via.placeholder.com/800x400"})`, height: '100%', width: '100%' }}
            section="donate_1"
          />
        </div>
        <button
          className="mt-2 text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
          style={{ backgroundColor: buttonColor }}
        >
          Ủng hộ
        </button>
      </div>
    </div>
  </section>
);
}


export default DonateOverview