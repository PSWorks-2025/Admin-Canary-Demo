import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import ImageInput from "./Inputs/ImageInput"
import { TextInput } from "./Inputs/TextInput";
import SectionWrap from "./SectionWrap";

const FundraisingHeader = ({
  image_url,
  fundraiser_name,
  amount_raised,
  goal_amount,
  qr_code_url,
  onSupportClick,
  setFundraising,
  enqueueImageUpload,
  enqueueImageDelete,
  setHasChanges,
  buttonColor,
  sectionTitles,
  setSectionTitles
}) => {
  const [localFundraiserName, setLocalFundraiserName] = useState(fundraiser_name || "");
  const [localAmountRaised, setLocalAmountRaised] = useState(amount_raised || 0);
  const [localGoalAmount, setLocalGoalAmount] = useState(goal_amount || 0);
  const [localSectionTitle, setLocalSectionTitle] = useState(sectionTitles.fundraising_header || "");

  const currencyFormatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`FundraisingHeader: Updating ${field} to ${value}`);
      const debouncedUpdate = debounce((field, value) => {
        if (field === 'section_title') {
          setSectionTitles(prev => ({ ...prev, fundraising_header: value }));
        } else {
          setFundraising(prev => ({ ...prev, [field]: value }));
        }
        setHasChanges(true);
      }, 500);

      if (field === "fundraiser_name") {
        setLocalFundraiserName(value);
      } else if (field === "amount_raised") {
        setLocalAmountRaised(Number(value) || 0);
      } else if (field === "goal_amount") {
        setLocalGoalAmount(Number(value) || 0);
      } else if (field === "section_title") {
        setLocalSectionTitle(value);
      }
      debouncedUpdate(field, value);
    },
    [setFundraising, setSectionTitles, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (field, file) => {
      if (file instanceof File || file instanceof Blob) {
        if (!file.type.startsWith('image/')) {
          console.error(`FundraisingHeader: Selected file for ${field} is not an image`);
          return;
        }
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
          console.error(`FundraisingHeader: File size for ${field} exceeds 5MB`);
          return;
        }

        console.log(`FundraisingHeader: Enqueuing image for ${field}`);
        const blobUrl = URL.createObjectURL(file);
        const storagePath = `main_pages/fundraising/${field}.jpg`;
        enqueueImageUpload({
          key: `main_pages.fundraising.${field}`,
          path: storagePath,
          file,
          oldUrl: field === 'image_url' ? image_url : qr_code_url,
        });
        setFundraising(prev => ({
          ...prev,
          [field]: blobUrl
        }));
        setHasChanges(true);
      } else {
        console.error(`FundraisingHeader: Invalid file for ${field}:`, file);
      }
    },
    [enqueueImageUpload, enqueueImageDelete, setFundraising, setHasChanges, image_url, qr_code_url]
  );

  const progress = goal_amount > 0 ? (amount_raised / goal_amount) * 100 : 0;

  return (
    <SectionWrap borderColor={buttonColor} className="relative max-w-4xl mx-auto">
      <TextInput
        className="text-2xl sm:text-[2.5rem] font-bold text-center text-gray-900 mb-4"
        value={localSectionTitle}
        onChange={e => handleChange("section_title", e.target.value)}
        placeholder="Nhập tiêu đề phần gây quỹ"
      />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <ImageInput
            handleImageUpload={e => handleImageUpload("image_url", e.target.files[0])}
            section="fundraising-image"
            top="top-2"
            left="left-2"
            className="w-full h-64 sm:h-80 md:h-96 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${image_url || "https://via.placeholder.com/300"})` }}
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <TextInput
              className="text-xl sm:text-2xl font-semibold text-gray-900 bg-white/80 border border-gray-300 rounded px-2 py-1 outline-none w-full"
              value={localFundraiserName}
              onChange={e => handleChange("fundraiser_name", e.target.value)}
              placeholder="Nhập tên quỹ"
            />
            <div className="mt-4">
              <div className="text-lg font-medium text-gray-700">
                Số tiền đã quyên góp: {currencyFormatter.format(localAmountRaised)}
              </div>
              <div className="text-lg font-medium text-gray-700">
                Mục tiêu: {currencyFormatter.format(localGoalAmount)}
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <ImageInput
              handleImageUpload={e => handleImageUpload("qr_code_url", e.target.files[0])}
              section="qr-code"
              top="top-2"
              left="left-2"
              className="w-32 h-32 sm:w-40 sm:h-40 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${qr_code_url || "https://via.placeholder.com/300"})` }}
            />
            <button
              className="mt-4 text-white font-medium px-5 py-2 rounded-full hover:opacity-80 transition-opacity duration-200"
              style={{ backgroundColor: buttonColor || '#4160DF' }}
              onClick={onSupportClick}
            >
              Ủng hộ ngay
            </button>
          </div>
        </div>
      </div>
    </SectionWrap>
  );
};

FundraisingHeader.propTypes = {
  image_url: PropTypes.string,
  fundraiser_name: PropTypes.string,
  amount_raised: PropTypes.number,
  goal_amount: PropTypes.number,
  qr_code_url: PropTypes.string,
  onSupportClick: PropTypes.func.isRequired,
  setFundraising: PropTypes.func.isRequired,
  enqueueImageUpload: PropTypes.func.isRequired,
  enqueueImageDelete: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
  sectionTitles: PropTypes.object.isRequired,
  setSectionTitles: PropTypes.func.isRequired
};

export default FundraisingHeader;