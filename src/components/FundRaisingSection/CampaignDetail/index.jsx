import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { TextInput } from "../../Inputs/TextInput";
import SectionWrap from "../../SectionWrap";

const CampaignDetails = ({ campaignTitle, campaignDescription, onFieldChange, buttonColor }) => {
  const [localTitle, setLocalTitle] = useState(campaignTitle);
  const [localDescription, setLocalDescription] = useState(campaignDescription);

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
      if (field === "campaignTitle") {
        setLocalTitle(value);
      } else {
        setLocalDescription(value);
      }
      debouncedHandleFieldChange(field, value);
    },
    [onFieldChange]
  );

  return (
    <SectionWrap borderColor={buttonColor} className="mt-6 px-6 max-w-2xl mx-auto">
      <TextInput
        className="text-4xl font-bold text-gray-900 outline-none bg-transparent w-full border rounded px-2 py-1"
        value={localTitle}
        onChange={(e) => handleChange("campaignTitle", e.target.value)}
        placeholder="Nhập tiêu đề chiến dịch"
      />
      <TextInput
        type="textarea"
        className="text-gray-700 mt-2 outline-none bg-transparent resize-none w-full border rounded px-2 py-1"
        value={localDescription}
        onChange={(e) => handleChange("campaignDescription", e.target.value)}
        placeholder="Nhập mô tả chiến dịch"
        rows="4"
      />
    </SectionWrap>
  );
};

CampaignDetails.propTypes = {
  campaignTitle: PropTypes.string.isRequired,
  campaignDescription: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

export default CampaignDetails;