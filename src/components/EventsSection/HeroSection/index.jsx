import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ImageInput } from '../../Inputs/ImageInput';
import { TextInput } from '../../Inputs/TextInput';

const HeroSection = ({
  title,
  description,
  backgroundImage,
  setHeroSections,
  enqueueImageUpload,
  setHasChanges,
}) => {
  const [localTitle, setLocalTitle] = useState(title || '');
  const [localDescription, setLocalDescription] = useState(description || '');

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`HeroSection: Updating ${field} to ${value}`);
      const debouncedUpdate = debounce((field, value) => {
        setHeroSections((prev) => ({
          ...prev,
          events: { ...prev.events, [field]: value },
        }));
        setHasChanges(true);
      }, 500);
      if (field === 'title') setLocalTitle(value);
      else setLocalDescription(value);
      debouncedUpdate(field, value);
    },
    [setHeroSections, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`HeroSection: Enqueuing image for image`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero/events/${file.name}`;
        enqueueImageUpload(
          `main_pages.hero_sections.events.image`,
          storagePath,
          file
        );
        setHeroSections((prev) => ({
          ...prev,
          events: { ...prev.events, image: blobUrl },
        }));
        setHasChanges(true);
      } else {
        console.error(`HeroSection: Invalid file for image:`, file);
      }
    },
    [enqueueImageUpload, setHeroSections, setHasChanges]
  );

  return (
    <div>
      <ImageInput
        handleImageUpload={(e) => handleImageUpload(e.target.files[0])}
        className="w-full h-[80vh] sm:h-[90vh] md:h-[calc(100vh-5rem)] bg-cover bg-bottom flex justify-center items-end bg-blend-multiply hero_section cursor-pointer"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url("${
            backgroundImage ||
            'https://blog.photobucket.com/hubfs/upload_pics_online.png'
          }")`,
        }}
      >
        <div className="w-full sm:w-3/4 md:w-1/2 absolute left-4 sm:left-10 ">
          <TextInput
            className="ml-8 sm:mb-2 md:mb-4 p-2 w-full text-2xl sm:text-3xl md:text-[2.5rem] font-semibold text-white outline-none bg-transparent"
            style={{ textShadow: 'rgba(0, 0, 0, 0.6) 0px 1px 3px' }}
            value={localTitle}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Nhập tiêu đề"
          />
          <TextInput
            type="textarea"
            className="ml-8 sm:mb-2 md:mb-4 p-2 w-full text-sm sm:text-base text-white outline-none bg-transparent resize-none"
            style={{ textShadow: 'rgba(0, 0, 0, 0.6) 0px 1px 3px' }}
            value={localDescription}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Nhập mô tả"
            rows="3 sm:4"
          />
        </div>
      </ImageInput>
    </div>
  );
};

HeroSection.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  backgroundImage: PropTypes.string,
  setHeroSections: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
};

export default HeroSection;
