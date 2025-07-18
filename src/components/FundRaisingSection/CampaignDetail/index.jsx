import React from "react";
import PropTypes from "prop-types";
import { TextInput } from "../../Inputs/TextInput";

const CampaignDetails = ({ campaignTitle, campaignDescription, handleFieldChange }) => {
  return (
    <div className="mt-6 px-6 max-w-2xl mx-auto">
      <TextInput
        className="text-4xl font-bold text-gray-900 outline-none bg-transparent w-full border rounded px-2 py-1"
        value={campaignTitle}
        onChange={(e) => handleFieldChange("campaignTitle", e.target.value)}
        placeholder="Nhập tiêu đề chiến dịch"
      />
      <TextInput
        type="textarea"
        className="text-gray-700 mt-2 outline-none bg-transparent resize-none w-full border rounded px-2 py-1"
        value={campaignDescription}
        onChange={(e) => handleFieldChange("campaignDescription", e.target.value)}
        placeholder="Nhập mô tả chiến dịch"
        rows="4"
      />
    </div>
  );
};

CampaignDetails.propTypes = {
  campaignTitle: PropTypes.string.isRequired,
  campaignDescription: PropTypes.string.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
};

export default CampaignDetails;