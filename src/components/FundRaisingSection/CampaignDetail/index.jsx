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
  sectionTitles,
  setSectionTitles
}) => {
  const [localTitle, setLocalTitle] = useState(campaign_title || "");
  const [localDescription, setLocalDescription] = useState(campaign_description || "");
  const [localSectionTitle, setLocalSectionTitle] = useState(sectionTitles.campaign_details || "");

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
        if (field === 'section_title') {
          setSectionTitles(prev => ({ ...prev, campaign_details: value }));
        } else {
          setFundraising(prev => ({ ...prev, [field]: value }));
        }
        setHasChanges(true);
      }, 500);
      if (field === "campaign_title") {
        setLocalTitle(value);
      } else if (field === "campaign_description") {
        setLocalDescription(value);
      } else if (field === "section_title") {
        setLocalSectionTitle(value);
      }
      debouncedUpdate(field, value);
    },
    [setFundraising, setSectionTitles, setHasChanges]
  );

  return (
    <SectionWrap borderColor={buttonColor} className="mt-6 px-6 max-w-2xl mx-auto">
      <TextInput
        className="text-2xl sm:text-[2.5rem] font-bold text-gray-900 bg-white/80 border border-gray-300 rounded px-2 py-1 outline-none w-full"
        value={localSectionTitle}
        onChange={e => handleChange("section_title", e.target.value)}
        placeholder="Nhập tiêu đề phần chiến dịch"
      />
      <TextInput
        className="text-2xl sm:text-[2.5rem] font-bold text-gray-900 bg-white/80 border border-gray-300 rounded px-2 py-1 outline-none w-full mt-4"
        value={localTitle}
        onChange={e => handleChange("campaign_title", e.target.value)}
        placeholder="Nhập tiêu đề của quỹ"
      />
      <TextInput
        type="textarea"
        className="text-gray-700 mt-2 bg-white/80 border border-gray-300 rounded px-2 py-1 outline-none resize-none w-full"
        value={localDescription}
        onChange={e => handleChange("campaign_description", e.target.value)}
        placeholder="Nhập mô tả của quỹ"
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
  sectionTitles: PropTypes.object.isRequired,
  setSectionTitles: PropTypes.func.isRequired
};

export default CampaignDetails;