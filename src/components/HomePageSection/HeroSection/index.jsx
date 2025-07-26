import { useState, useEffect, useContext } from 'react';
import { ImageInput } from '../../Inputs/ImageInput';
import GlobalContext from '../../../GlobalContext';

// path: Main pages.heroSections.home

const HeroSection = () => {
  const { heroSections, setHeroSections, enqueueImageUpload } =
    useContext(GlobalContext);
  const [localImage, setLocalImage] = useState(heroSections.home?.image || '');

  // Keep local image in sync with props
  useEffect(() => {
    setLocalImage(heroSections.home?.image || '');
  }, [heroSections.home?.image]);

  const handleLocalImageChange = (file) => {
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);

    // Update local preview
    setLocalImage(tempUrl);

    // Update parent state through setHeroSections
    setHeroSections((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        image: tempUrl,
      },
    }));

    // Queue image upload
    enqueueImageUpload({
      key: 'main_pages.hero_sections.home.image',
      file,
      path: 'main_pages/hero_sections/home/image.jsx',
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
        imagePreview={localImage}
        style={{
          height: 'calc(100vh - 5rem)',
        }}
      />
    </div>
  );
};

export default HeroSection;
