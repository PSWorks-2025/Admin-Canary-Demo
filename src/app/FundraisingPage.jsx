import React, { useContext } from "react";
import PropTypes from "prop-types";
import useImagePreloader from "../hooks/useImagePreloader";
import LoadingScreen from "../components/screens/LoadingScreen";
import FundraisingHeader from "../components/FundraisingHeader";
import DonorList from "../components/DonorList";
import CampaignDetails from "../components/FundRaisingSection/CampaignDetail";
import { motion } from "framer-motion";
import GlobalContext from "../GlobalContext";

const FundraisingPage = () => {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    fundraising,
    setFundraising,
    enqueueImageUpload,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    fundraising?.image_url || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    fundraising?.qr_code_url || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const updateField = (field, value) => {
    console.log(`Updating field ${field} with value ${value}`);
    setFundraising((prev) => ({
      ...prev,
      [field]: field === "goal_amount" || field === "amount_raised" ? Number(value) || 0 : value,
    }));
  };

  const updateImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      console.log(`Enqueuing image for ${field}:`, file);
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `fundraising/${file.name}`;
      enqueueImageUpload(`Main pages.fundraising.${field}`, storagePath, file);
      setFundraising((prev) => ({ ...prev, [field]: blobUrl }));
    } else {
      console.error(`Invalid file for ${field}:`, file);
    }
  };

  const updateDonor = (index, field, value) => {
    console.log(`Updating donor[${index}].${field} with value ${value}`);
    setFundraising((prev) => {
      const newDonors = [...prev.donors];
      newDonors[index] = {
        ...newDonors[index],
        [field]: field === "amount" ? Number(value) || 0 : value,
      };
      return {
        ...prev,
        donors: newDonors,
        amount_raised: newDonors.reduce((sum, donor) => sum + (Number(donor.amount) || 0), 0),
      };
    });
  };

  const addDonor = () => {
    const newId = `donor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`Adding donor with id ${newId}`);
    setFundraising((prev) => ({
      ...prev,
      donors: [...prev.donors, { id: newId, name: "", amount: 0 }],
    }));
  };

  const deleteDonor = (index) => {
    console.log(`Deleting donor at index ${index}`);
    setFundraising((prev) => {
      const newDonors = prev.donors.filter((_, i) => i !== index);
      return {
        ...prev,
        donors: newDonors,
        amount_raised: newDonors.reduce((sum, donor) => sum + (Number(donor.amount) || 0), 0),
      };
    });
  };

  const handleSupportClick = () => {
    alert("Cảm ơn bạn đã ủng hộ! 🎉");
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div
      style={{ backgroundColor: primaryBackgroundColor }}
      className="min-h-screen relative overflow-hidden p-6"
    >
      <FundraisingHeader
        image_url={fundraising?.image_url || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}
        fundraiser_name={fundraising?.fundraiser_name || ""}
        amount_raised={fundraising?.amount_raised || 0}
        goal_amount={fundraising?.goal_amount || 0}
        qr_code_url={fundraising?.qr_code_url || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}
        onSupportClick={handleSupportClick}
        onFieldChange={updateField}
        onImageUpload={updateImage}
        buttonColor={secondaryBackgroundColor}
      />
      <CampaignDetails
        campaign_title={fundraising?.campaign_title || ""}
        campaign_description={fundraising?.campaign_description || ""}
        onFieldChange={updateField}
        buttonColor={secondaryBackgroundColor}
      />
      <DonorList
        donors={fundraising?.donors || []}
        onDonorChange={updateDonor}
        onAddDonor={addDonor}
        onDeleteDonor={deleteDonor}
        buttonColor={secondaryBackgroundColor}
      />
    </div>
  );
};

FundraisingPage.propTypes = {
  campaign_title: PropTypes.string,
  campaign_description: PropTypes.string,
  image_url: PropTypes.string,
  fundraiser_name: PropTypes.string,
  amount_raised: PropTypes.number,
  goal_amount: PropTypes.number,
  qr_code_url: PropTypes.string,
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
};

export default FundraisingPage;