import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { TextInput } from "../../Inputs/TextInput";
import SectionWrap from "../../SectionWrap";

const CampaignDetails = ({ campaign_title, campaign_description, onFieldChange, buttonColor }) => {
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
      const debouncedHandleFieldChange = debounce(onFieldChange, 500);
      if (field === "campaign_title") {
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
        onChange={(e) => handleChange("campaign_title", e.target.value)}
        placeholder="Nhập tiêu đề chiến dịch"
      />
      <TextInput
        type="textarea"
        className="text-gray-700 mt-2 outline-none bg-transparent resize-none w-full border rounded px-2 py-1"
        value={localDescription}
        onChange={(e) => handleChange("campaign_description", e.target.value)}
        placeholder="Nhập mô tả chiến dịch"
        rows="4"
      />
    </SectionWrap>
  );
};

CampaignDetails.propTypes = {
  campaign_title: PropTypes.string,
  campaign_description: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  buttonColor: PropTypes.string,
};

export default CampaignDetails;