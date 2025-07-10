import { useRef } from "react";

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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="w-full h-178 bg-cover bg-center relative"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        height: "calc(100vh - 5rem)",
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />
      <button
        onClick={triggerFileInput}
        className="absolute top-4 right-4 py-2 px-4 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title z-10"
      >
        Upload Image
      </button>
      <input
        type="color"
        id="colorPicker"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
};

export default HeroSection;