import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "./Inputs/ImageInput";
import { TextInput } from "./Inputs/TextInput";

const FundraisingHeader = ({
  imageUrl,
  fundraiserName,
  amountRaised,
  goalAmount,
  qrCodeUrl,
  onSupportClick,
  onFieldChange,
  onImageUpload,
  buttonColor,
}) => {
  const [localFundraiserName, setLocalFundraiserName] = useState(fundraiserName);
  const [localGoalAmount, setLocalGoalAmount] = useState(goalAmount);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      const debouncedHandleFieldChange = debounce(onFieldChange, 1500);
      if (field === "fundraiserName") {
        setLocalFundraiserName(value);
        debouncedHandleFieldChange(field, value);
      } else if (field === "goalAmount") {
        const finalValue = value === "" ? "" : Number(value) >= 0 ? Number(value) : 0;
        setLocalGoalAmount(finalValue);
        if (value !== "") {
          debouncedHandleFieldChange(field, Number(value) || 0);
        }
      }
    },
    [onFieldChange]
  );

  const progressPercentage = localGoalAmount > 0 ? Math.min((amountRaised / localGoalAmount) * 100, 100) : 0;

  return (
    <div>
      <ImageInput
        handleImageUpload={(e) => onImageUpload("imageUrl", e.target.files[0])}
        section="fundraising-header"
        top="top-2"
        right="right-2"
        className="relative w-full h-[400px] bg-cover bg-center bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${imageUrl})`,
        }}
      >
        <div className="absolute bottom-4 left-4 right-4">
          <TextInput
            className="text-2xl font-bold text-white outline-none bg-transparent border rounded px-2 py-1"
            value={localFundraiserName}
            onChange={(e) => handleChange("fundraiserName", e.target.value)}
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
              <p className="text-white whitespace-nowrap">
                Đã quyên góp: {amountRaised.toLocaleString()} /
              </p>
              <div className="flex flex-row items-center">
                <TextInput
                  type="number"
                  className="text-white ml-2 outline-none bg-transparent rounded px-2 py-1 w-32"
                  value={localGoalAmount}
                  onChange={(e) => handleChange("goalAmount", e.target.value)}
                  placeholder="Nhập mục tiêu"
                  min="0"
                />
                <p className="text-white ml-1">VND</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <ImageInput
              handleImageUpload={(e) => onImageUpload("qrCodeUrl", e.target.files[0])}
              section="qr-code"
              top="top-2"
              left="left-2"
              className="w-24 h-24 object-cover"
              style={{ backgroundImage: `url("${qrCodeUrl || 'https://blog.photobucket.com/hubfs/upload_pics_online.png'}")` }}
            />
            <button
              className="ml-4 text-white font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity duration-200"
              style={{ backgroundColor: buttonColor || "#4160DF" }}
              onClick={onSupportClick}
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
  imageUrl: PropTypes.string.isRequired,
  fundraiserName: PropTypes.string.isRequired,
  amountRaised: PropTypes.number.isRequired,
  goalAmount: PropTypes.number.isRequired,
  qrCodeUrl: PropTypes.string.isRequired,
  onSupportClick: PropTypes.func.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default FundraisingHeader;