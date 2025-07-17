import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "../components/Inputs/ImageInput.jsx";
import { TextInput } from "../components/Inputs/TextInput.jsx";

const FundraisingHeader = ({
  imageUrl,
  fundraiserName,
  amountRaised,
  goalAmount,
  qrCodeUrl,
  onSupportClick,
  handleFieldChange,
  handleImageUpload,
  buttonColor,
}) => {
  const [localFundraiserName, setLocalFundraiserName] = useState(fundraiserName);
  const [localGoalAmount, setLocalGoalAmount] = useState(goalAmount);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const debouncedHandleFieldChange = debounce(handleFieldChange, 1500);

  const handleChange = (field, value) => {
    console.log("FundraisingHeader handleChange:", { field, value });
    if (field === "fundraiserName") {
      setLocalFundraiserName(value);
      debouncedHandleFieldChange(field, value);
    } else if (field === "goalAmount") {
      setLocalGoalAmount(value === "" ? "" : Number(value) >= 0 ? Number(value) : 0);
    }
  };

  const handleBlur = (field, value) => {
    console.log("FundraisingHeader handleBlur:", { field, value });
    if (field === "goalAmount") {
      const finalValue = value === "" || isNaN(value) ? 0 : Number(value);
      setLocalGoalAmount(finalValue);
      handleFieldChange(field, finalValue);
    }
  };

  const progressPercentage = localGoalAmount > 0 ? Math.min((amountRaised / localGoalAmount) * 100, 100) : 0;

  console.log("FundraisingHeader rendered:", { fundraiserName, goalAmount: localGoalAmount });

  return (
    <div
      className="relative w-full h-[400px] bg-cover bg-center bg-blend-multiply"
      style={{
        backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${imageUrl})`,
      }}
    >
      <ImageInput
        handleImageUpload={(file) => handleImageUpload("imageUrl", file.target.files[0])}
        section="fundraising-header"
        top="top-2"
        right="right-2"
      />
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
                onBlur={(e) => handleBlur("goalAmount", e.target.value)}
                placeholder="Nhập mục tiêu"
                min="0"
              />
              <p className="text-white ml-1">VND</p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="w-24 h-24 object-cover"
          />
          <ImageInput
            handleImageUpload={(file) => handleImageUpload("qrCodeUrl", file.target.files[0])}
            section="qr-code"
            top="top-2"
            left="left-2"
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
  handleFieldChange: PropTypes.func,
  handleImageUpload: PropTypes.func,
  buttonColor: PropTypes.string,
};

export default memo(FundraisingHeader);