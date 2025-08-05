import { useState, useEffect, useContext } from 'react';
import { ImageInput } from '../../Inputs/ImageInput';
import GlobalContext from '../../../GlobalContext';

// path: Main pages.heroSections.home

const HeroSection = () => {
  const { heroSections, setHeroSections, enqueueImageUpload, enqueueImageDelete } =
    useContext(GlobalContext);
  const [localImage, setLocalImage] = useState(heroSections.home?.image || '');

  // Keep local image in sync with props
  useEffect(() => {
    setLocalImage(heroSections.home?.image || '');
  }, [heroSections.home?.image]);

  const handleLocalImageChange = (file) => {
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    const oldUrl = heroSections.home?.image;
    setLocalImage(tempUrl);

    setHeroSections((prev) => ({
      ...prev,
      home: {
        ...prev.home,
        image: tempUrl,
      },
    }));

    enqueueImageUpload({
      key: 'main_pages.hero_sections.home.image',
      path: 'main_pages/hero_sections/home/image.jpg',
      file,
      oldUrl,
    });
  };

  useEffect(() => {
    return () => {
      if (localImage.startsWith('blob:')) {
        URL.revokeObjectURL(localImage);
      }
    };
  }, [localImage]);

  return (
    <div className="w-full">
      <ImageInput
        handleImageUpload={(e) => handleLocalImageChange(e.target.files[0])}
        section="hero"
        className="w-full h-96 md:h-128 lg:h-[80vh] bg-cover bg-center relative"
        style={{
          backgroundImage: `url("${
            heroSections?.home?.image ||
            'https://blog.photobucket.com/hubfs/upload_pics_online.png'
          }")`,
        }}
      />
    </div>
  );
};

export default HeroSection;