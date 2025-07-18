import { useState, useEffect } from 'react';
import { ImageInput } from '../../Inputs/ImageInput';

const HeroSection = ({ data, setData, enqueueImageUpload }) => {
  const [localImage, setLocalImage] = useState(data.home?.image || '');

  // Keep local image in sync with props
  useEffect(() => {
    setLocalImage(data.home?.image || '');
  }, [data.home?.image]);

  const handleLocalImageChange = (file) => {
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);

    // Update local preview
    setLocalImage(tempUrl);

    // Update parent state through setData
    setData((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        image: tempUrl,
      },
    }));

    // Queue image upload
    enqueueImageUpload({
      section: 'hero',
      key: 'home',
      file,
      path: 'hero_section/home',
    });
  };

  return (
    <div>
      <ImageInput
        handleImageUpload={(e) => handleLocalImageChange(e.target.files[0])}
        section="hero"
        top="top-4"
        right="right-4"
        className="w-full h-178 bg-cover bg-center relative"
        style={{
          backgroundImage: `url("${
            backgroundImage ||
            'https://blog.photobucket.com/hubfs/upload_pics_online.png'
          }")`,
          height: 'calc(100vh - 5rem)',
        }}
      />
    </div>
  );
};

export default HeroSection;
