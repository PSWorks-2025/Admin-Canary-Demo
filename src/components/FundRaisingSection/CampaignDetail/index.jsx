import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { TextInput } from "../../Inputs/TextInput";
import SectionWrap from "../../SectionWrap";

const CampaignDetails = ({
  campaign_title,
  campaign_description,
  setFundraising,
  setHasChanges,
  buttonColor,
}) => {
  const [localTitle, setLocalTitle] = useState(campaign_title || "");
  const [localDescription, setLocalDescription] = useState(campaign_description || "");

  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const handleChange = useCallback(
    (field, value) => {
      console.log(`CampaignDetails: Updating ${field} to ${value}`);
      const debouncedUpdate = debounce((field, value) => {
        setFundraising((prev) => ({
          ...prev,
          [field]: value,
        }));
        setHasChanges(true);
      }, 500);
      if (field === "campaign_title") {
        setLocalTitle(value);
      } else {
        setLocalDescription(value);
      }
      debouncedUpdate(field, value);
    },
    [setFundraising, setHasChanges]
  );

  return (
    <SectionWrap borderColor={buttonColor} className="mt-6 px-6 max-w-2xl mx-auto">
      <TextInput
        className="text-2xl sm:text-[2.5rem] font-bold text-gray-900 bg-white/80 border border-gray-300 rounded px-2 py-1 outline-none w-full"
        value={localTitle}
        onChange={(e) => {
          e.stopPropagation();
          handleChange("campaign_title", e.target.value);
        }}
        placeholder="Nhập tiêu đề chiến dịch"
      />
      <TextInput
        type="textarea"
        className="text-gray-700 mt-2 bg-white/80 border border-gray-300 rounded px-2 py-1 outline-none resize-none w-full"
        value={localDescription}
        onChange={(e) => {
          e.stopPropagation();
          handleChange("campaign_description", e.target.value);
        }}
        placeholder="Nhập mô tả chiến dịch"
        rows="4"
      />
    </SectionWrap>
  );
};

CampaignDetails.propTypes = {
  campaign_title: PropTypes.string,
  campaign_description: PropTypes.string,
  setFundraising: PropTypes.func.isRequired,
  setHasChanges: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default CampaignDetails;