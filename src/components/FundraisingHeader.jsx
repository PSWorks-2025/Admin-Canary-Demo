import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ImageInput } from './Inputs/ImageInput';
import { TextInput } from './Inputs/TextInput';

const FundraisingHeader = ({
  image_url,
  fundraiser_name,
  amount_raised,
  goal_amount,
  qr_code_url,
  onSupportClick,
  setFundraising,
  enqueueImageUpload,
  setHasChanges,
  buttonColor,
}) => {
  const [localFundraiserName, setLocalFundraiserName] = useState(
    fundraiser_name || ''
  );
  const [localGoalAmount, setLocalGoalAmount] = useState(goal_amount || 0);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`FundraisingHeader: Updating ${field} to ${value}`);

      if (field === 'fundraiser_name') {
        setLocalFundraiserName(value);
        setFundraising((prev) => ({ ...prev, [field]: value }));
      } else if (field === 'goal_amount') {
        const finalValue =
          value === '' ? '' : Number(value) >= 0 ? Number(value) : 0;
        setLocalGoalAmount(finalValue);
        if (value !== '') {
          setFundraising((prev) => ({
            ...prev,
            [field]: finalValue,
          }));
        }
      } else {
        setFundraising((prev) => ({
          ...prev,
          [field]: value,
        }));
      }

      setHasChanges(true);
    },
    [setFundraising, setHasChanges]
  );

  const handleImageUpload = useCallback(
    (field, file) => {
      console.log(
        `FundraisingHeader: handleImageUpload called for ${field} with file:`,
        file
      );
      if (!file) {
        console.error(`FundraisingHeader: No file selected for ${field}`);
        return;
      }
      if (!(file instanceof File || file instanceof Blob)) {
        console.error(
          `FundraisingHeader: Invalid file type for ${field}:`,
          file
        );
        return;
      }
      if (!file.type.startsWith('image/')) {
        console.error(
          `FundraisingHeader: Selected file is not an image for ${field}`
        );
        return;
      }
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_FILE_SIZE) {
        console.error(`FundraisingHeader: File size exceeds 5MB for ${field}`);
        return;
      }

      const blobUrl = URL.createObjectURL(file);
      console.log(`FundraisingHeader: Blob URL created for ${field}:`, blobUrl);
      const storagePath = `fundraising/${field}/${file.name}`;
      enqueueImageUpload(`main_pages.fundraising.${field}`, storagePath, file);
      setFundraising((prev) => ({ ...prev, [field]: blobUrl }));
      setHasChanges(true);
    },
    [enqueueImageUpload, setFundraising, setHasChanges]
  );

  const progressPercentage =
    localGoalAmount > 0
      ? Math.min((amount_raised / localGoalAmount) * 100, 100)
      : 0;

  return (
    <div>
      <ImageInput
        handleImageUpload={(e) => {
          console.log(
            'FundraisingHeader: ImageInput onChange triggered for image_url'
          );
          handleImageUpload('image_url', e.target.files[0]);
        }}
        section="fundraising-header"
        top="top-2"
        right="right-2"
        className="relative w-full h-[400px] bg-cover bg-center bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.5)), url(${
            image_url || 'https://via.placeholder.com/300'
          })`,
        }}
      >
        <div className="absolute bottom-4 left-4 right-4 event">
          <TextInput
            className="text-2xl font-bold text-white bg-black/50 border border-white/30 rounded px-2 py-1 outline-none w-full z-10"
            value={localFundraiserName}
            onChange={(e) => {
              e.stopPropagation();
              handleChange('fundraiser_name', e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="Nhập tên quỹ"
          />
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center mt-1">
              <span
                className="text-white mx-2"
                style={{ textShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 3px' }}
              >
                Số tiền cần đạt được:{' '}
              </span>
              <TextInput
                type="number"
                className="text-white inline-block bg-black/50 border border-white/30 rounded px-2 py-1 outline-none w-32 z-10"
                value={amount_raised}
                onChange={(e) => {
                  e.stopPropagation();
                  handleChange('amount_raised', e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder="Nhập số đã quyên góp"
                min="0"
              />
              <span
                className="text-white mx-2"
                style={{ textShadow: 'rgba(0, 0, 0, 0.6) 0px 3px 3px' }}
              >
                Số tiền cần đạt được:{' '}
              </span>
              <div className="flex flex-row items-center">
                <TextInput
                  type="number"
                  className="text-white ml-2 bg-black/50 border border-white/30 rounded px-2 py-1 outline-none w-32 z-10"
                  value={localGoalAmount}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChange('goal_amount', e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Nhập mục tiêu"
                  min="0"
                />
                <p className="text-white ml-1">VND</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ImageInput
              handleImageUpload={(e) => {
                console.log(
                  'FundraisingHeader: ImageInput onChange triggered for qr_code_url'
                );
                e.stopPropagation();
                handleImageUpload('qr_code_url', e.target.files[0]);
              }}
              section="qr-code"
              top="top-2"
              left="left-2"
              className="w-24 h-24 object-cover z-10"
              style={{
                backgroundImage: `url("${
                  qr_code_url || 'https://via.placeholder.com/300'
                }")`,
              }}
            />
            <button
              className="ml-4 text-white font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity duration-200 z-10"
              style={{ backgroundColor: buttonColor || '#4160DF' }}
              onClick={(e) => {
                e.stopPropagation();
                onSupportClick();
              }}
            >
              Ủng hộ ngay
            </button>
          </div>
        </div>
      </ImageInput>
    </div>
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
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default FundraisingHeader;
