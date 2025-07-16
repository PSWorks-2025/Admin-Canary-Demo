import { useRef } from "react";
import { ImageInput } from "../../Inputs/ImageInput";

const HeroSection = ({ backgroundImage, setBackgroundImage, color, setColor }) => {
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="w-full h-178 bg-cover bg-center relative"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        height: "calc(100vh - 5rem)",
      }}
    >
      <ImageInput
        handleImageUpload={handleImageUpload}
        // triggerFileInput={fileInputRef.current}
        section="hero"
        top="top-4"
        right="right-4"
      />
      {/* <input
        type="color"
        id="colorPicker"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      /> */}
    </div>
  );
};

export default HeroSection;