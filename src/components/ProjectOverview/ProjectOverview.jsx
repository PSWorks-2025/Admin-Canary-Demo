import React from "react";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";
function ProjectOverview({ pageData, handleFieldChange, handleImageUpload,buttonColor }) {
  return (
    <section className="px-8 py-8">
      <input
        className="w-full text-[2.5rem] font-bold text-black outline-none bg-transparent text-center mb-6"
        value={pageData.heading}
        onChange={(e) => handleFieldChange("heading", e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="flex flex-row justify-center gap-10">
        <div className="flex justify-center">
          <div className="grid grid-cols-2 gap-5 relative w-[600px] max-w-full">
            {pageData.images.map((image, index) => (
              <div key={index} className="relative w-full h-full">
                <img
                  src={image || "https://via.placeholder.com/150"}
                  alt={`Image ${index + 1}`}
                  className={`w-full h-[200px] object-cover rounded-xl shadow-md ${
                    index === 2 ? "absolute scale-105 z-10 -top-[60%] left-1/2" : index===4 ?"absolute -top-55":""
                  }`}
                />
                <ImageInput
                  handleImageUpload={(file) => handleImageUpload(index, file.target.files[0])}
                  top={index === 2 ? "-top-[60%]" : index === 4 ? "-top-55" : "top-2"}
                  left={index === 2 ? "left-1/2" : "left-2"}
                  section={`project_${index}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/5 ml-10">
          <TextInput
            className="w-full max-w-[400px] text-xl font-semibold text-black outline-none mx-auto mb-2"
            value={pageData.title}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            placeholder="Nhập tiêu đề dự án"
          />
          <TextInput
            type="textarea"
            className="w-full max-w-[400px] text-base text-[#333333] mb-2 outline-none bg-transparent resize-none"
            value={pageData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Nhập mô tả dự án"
            rows="5"
          />
          <br></br>
          <button
            className="text-white font-medium px-3 py-2 rounded-full hover:opacity-50 transition-opacity duration-200"
            style={{backgroundColor:buttonColor}}
          >
            Tìm hiểu thêm
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverview;