import { useRef } from "react";
import { ImageInput } from "../../Inputs/ImageInput";
import { TextInput } from "../../Inputs/TextInput";
const VisionSection = ({ vision, handleNestedFieldChange, handleNestedImageUpload}) => {
  return (
    <div className="w-full pt-20 flex flex-row-reverse">
      <div className="w-1/2 px-4 relative">
        <div
          className="w-162 h-102 -ml-26 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url("${vision.imageUrl}")` }}
        />
        <ImageInput
          handleImageUpload={(file) => handleNestedImageUpload("vision", "imageUrl", file.target.files[0])}
          section="vision"
          top="top-2"
          left="left-2"
        />
  
      </div>
      <div className="w-1/2 px-4 flex items-center justify-end">
        <div className="w-136 h-62 rounded-lg bg-tag-2 text-primary-title shadow-[-1.5rem_-1.5rem_#E6EBFB] z-0">
          <TextInput
            className="w-full font-bold text-[2.5rem] pt-12 text-center outline-none bg-transparent"
            value={vision.title}
            onChange={(e) => handleNestedFieldChange("vision", "title", e.target.value)}
            placeholder="Nhập tiêu đề tầm nhìn"
          />
          <TextInput
            type="textarea"
            className="w-full px-8 text-base/5 font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
            value={vision.description}
            onChange={(e) => handleNestedFieldChange("vision", "description", e.target.value)}
            placeholder="Nhập mô tả tầm nhìn"
            rows="4"
          />
        </div>
      </div>
    </div>
  );
};

export default VisionSection;