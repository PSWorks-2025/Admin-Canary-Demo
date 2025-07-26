import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { ImageInput } from "./Inputs/ImageInput";
import { TextInput } from "./Inputs/TextInput";

const FundraisingHeader = ({
  image_url,
  fundraiser_name,
  amount_raised,
  goal_amount,
  qr_code_url,
  onSupportClick,
  onFieldChange,
  onImageUpload,
  buttonColor,
}) => {
  const [localFundraiserName, setLocalFundraiserName] = useState(fundraiser_name || "");
  const [localGoalAmount, setLocalGoalAmount] = useState(goal_amount || 0);

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`FundraisingHeader: Changing ${field} to ${value}`);
      const debouncedHandleFieldChange = debounce(onFieldChange, 500);
      if (field === "fundraiser_name") {
        setLocalFundraiserName(value);
        debouncedHandleFieldChange(field, value);
      } else if (field === "goal_amount") {
        const finalValue = value === "" ? "" : Number(value) >= 0 ? Number(value) : 0;
        setLocalGoalAmount(finalValue);
        if (value !== "") {
          debouncedHandleFieldChange(field, Number(value) || 0);
        }
      }
    },
    [onFieldChange]
  );

  const progressPercentage = localGoalAmount > 0 ? Math.min((amount_raised / localGoalAmount) * 100, 100) : 0;

  return (
    <div>
      <ImageInput
        handleImageUpload={(e) => {
          console.log("Uploading image for image_url");
          onImageUpload("image_url", e.target.files[0]);
        }}
        section="fundraising-header"
        top="top-2"
        right="right-2"
        className="relative w-full h-[400px] bg-cover bg-center bg-blend-multiply"
        style={{
          backgroundImage: `linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.6)), url(${image_url || "https://blog.photobucket.com/hubfs/upload_pics_online.png"})`,
        }}
      >
        <div className="absolute bottom-4 left-4 right-4 event">
          <TextInput
            className="text-2xl font-bold text-white outline-none bg-transparent border rounded px-2 py-1 z-10"
            value={localFundraiserName}
            onChange={(e) => {
              e.stopPropagation();
              handleChange("fundraiser_name", e.target.value);
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
              <p className="text-white whitespace-nowrap">
                Đã quyên góp: {amount_raised.toLocaleString()} /
              </p>
              <div className="flex flex-row items-center">
                <TextInput
                  type="number"
                  className="text-white ml-2 outline-none bg-transparent rounded px-2 py-1 w-32 z-10"
                  value={localGoalAmount}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleChange("goal_amount", e.target.value);
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
                e.stopPropagation();
                console.log("Uploading image for qr_code_url");
                onImageUpload("qr_code_url", e.target.files[0]);
              }}
              section="qr-code"
              top="top-2"
              left="left-2"
              className="w-24 h-24 object-cover z-10"
              style={{ backgroundImage: `url("${qr_code_url || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")` }}
            />
            <button
              className="ml-4 text-white font-medium px-4 py-2 rounded-full hover:opacity-80 transition-opacity duration-200 z-10"
              style={{ backgroundColor: buttonColor || "#4160DF" }}
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
  onFieldChange: PropTypes.func.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default FundraisingHeader;