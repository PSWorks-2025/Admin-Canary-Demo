import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ImageInput } from '../Inputs/ImageInput';
import { TextInput } from '../Inputs/TextInput';
import SectionWrap from '../SectionWrap';
import { useNavigate } from 'react-router';

function DonateOverview({
  pageData,
  setHeroSections,
  enqueueImageUpload,
  setHasChanges,
  buttonColor,
  sectionTitles, 
  setSectionTitles, 
}) {
  const [localTitle1, setLocalTitle1] = useState(pageData.title1 || '');
  const [localTitle2, setLocalTitle2] = useState(pageData.title2 || '');

  const navigate = useNavigate();

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`DonateOverview: Updating ${field} to ${value}`);
      if (field === 'heading') {
        setSectionTitles((prev) => ({ ...prev, donate_overview: value }));
        setHasChanges(true);
      } else {
        const debouncedUpdate = debounce((field, value) => {
          setHeroSections((prev) => ({
            ...prev,
            donate: { ...prev.donate, [field]: value },
          }));
          setHasChanges(true);
        }, 500);
        if (field === 'title1') setLocalTitle1(value);
        else setLocalTitle2(value);
        debouncedUpdate(field, value);
      }
    },
    [setHeroSections, setSectionTitles, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (index, file) => {
      if (file instanceof File || file instanceof Blob) {
        console.log(`DonateOverview: Enqueuing image for images[${index}]`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `hero/donate/${file.name}`;
        enqueueImageUpload(
          `main_pages.hero_sections.donate.images.${index}`,
          storagePath,
          file
        );
        setHeroSections((prev) => {
          const newImages = [...(prev.donate?.images || ['', ''])];
          newImages[index] = blobUrl;
          return {
            ...prev,
            donate: { ...prev.donate, images: newImages },
          };
        });
        setHasChanges(true);
      } else {
        console.error(
          `DonateOverview: Invalid file for images[${index}]:`,
          file
        );
      }
    },
    [enqueueImageUpload, setHeroSections, setHasChanges]
  );

  return (
    <SectionWrap className="w-full" borderColor={buttonColor}>
      <TextInput
        className="w-full text-2xl sm:text-[2.5rem] font-bold text-black outline-none bg-transparent text-center mb-4 sm:mb-6"
        value={sectionTitles.donate_overview}
        onChange={(e) => handleChange('heading', e.target.value)}
        placeholder="Nhập tiêu đề phần"
      />
      <div className="flex flex-col sm:flex-row justify-center items-start gap-6 sm:gap-10 text-center max-w-[1600px] mx-auto">
        <div className="flex flex-col flex-1 items-center">
          <div className="w-full h-[30vh] sm:h-[40vh] bg-gray-600 relative flex flex-col justify-end">
            <TextInput
              className="text-sm sm:text-base text-center font-semibold text-white outline-none bg-transparent mb-2"
              value={localTitle1}
              onChange={(e) => handleChange('title1', e.target.value)}
              placeholder="Nhập tiêu đề"
            />
            <ImageInput
              handleImageUpload={(e) => handleImageUpload(0, e.target.files[0])}
              className="bg-cover bg-center rounded-lg flex justify-center items-center"
              style={{
                backgroundImage: `url("${
                  pageData.images[0] ||
                  'https://blog.photobucket.com/hubfs/upload_pics_online.png'
                }")`,
                height: '100%',
                width: '100%',
              }}
              section="donate_0"
            />
          </div>
          <button
            className="mt-2 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:opacity-50 transition-opacity duration-200 text-sm sm:text-base"
            style={{ backgroundColor: buttonColor }}
            onClick={() => navigate('/donate')}
          >
            Mua ngay
          </button>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div className="w-full h-[30vh] sm:h-[40vh] bg-gray-600 relative flex flex-col justify-end">
            <TextInput
              className="text-sm sm:text-base font-semibold text-center text-white outline-none bg-transparent mb-2"
              value={localTitle2}
              onChange={(e) => handleChange('title2', e.target.value)}
              placeholder="Nhập tiêu đề"
            />
            <ImageInput
              handleImageUpload={(e) => handleImageUpload(1, e.target.files[0])}
              className="bg-cover bg-center rounded-lg flex justify-center items-center"
              style={{
                backgroundImage: `url("${
                  pageData.images[1] ||
                  'https://blog.photobucket.com/hubfs/upload_pics_online.png'
                }")`,
                height: '100%',
                width: '100%',
              }}
              section="donate_1"
            />
          </div>
          <button
            className="mt-2 text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:opacity-50 transition-opacity duration-200 text-sm sm:text-base"
            style={{ backgroundColor: buttonColor }}
            onClick={() => navigate('/donate')}
          >
            Ủng hộ
          </button>
        </div>
      </div>
    </SectionWrap>
  );
}

DonateOverview.propTypes = {
  pageData: PropTypes.shape({
    heading: PropTypes.string,
    title1: PropTypes.string,
    title2: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setHeroSections: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string.isRequired,
  sectionTitles: PropTypes.object.isRequired, 
  setSectionTitles: PropTypes.func.isRequired, 
};

export default DonateOverview;