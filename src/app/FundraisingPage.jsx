import React, { useContext, useState } from "react";
import { Timestamp } from "firebase/firestore";
import PropTypes from "prop-types";
import useImagePreloader from "../hooks/useImagePreloader";
import useFundraisingData from "../hooks/useFundraisingData";
import LoadingScreen from "../components/screens/LoadingScreen";
import FundraisingHeader from "../components/FundraisingHeader";
import DonorList from "../components/DonorList";
import CampaignDetails from "../components/FundRaisingSection/CampaignDetail";
import { ColorContext } from "../layout";
import { motion } from "framer-motion";

const FundraisingPage = () => {
  const { mainData, setMainData, primaryBackgroundColor, secondaryBackgroundColor } = useContext(ColorContext);
  const {
    localData,
    setLocalData,
    handleFieldChange,
    handleImageUpload,
    handleDonorChange,
    addDonor,
    deleteDonor,
    updateMainData,
  } = useFundraisingData(mainData, setMainData);

  const imagesLoaded = useImagePreloader([localData.imageUrl, localData.qrCodeUrl]);

  const handleSupportClick = () => {
    alert("Cảm ơn bạn đã ủng hộ! 🎉");
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }} className="min-h-screen relative overflow-hidden p-6">
      <FundraisingHeader
        imageUrl={localData.imageUrl}
        fundraiserName={localData.fundraiserName}
        amountRaised={localData.amountRaised}
        goalAmount={localData.goalAmount}
        qrCodeUrl={localData.qrCodeUrl}
        onSupportClick={handleSupportClick}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
        buttonColor={secondaryBackgroundColor}
      />
      <CampaignDetails
        campaignTitle={localData.campaignTitle}
        campaignDescription={localData.campaignDescription}
        handleFieldChange={handleFieldChange}
      />
      <DonorList
        donors={localData.donors}
        handleDonorChange={handleDonorChange}
        addDonor={addDonor}
        deleteDonor={deleteDonor}
        buttonColor={secondaryBackgroundColor}
      />
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 group"
        onClick={() => updateMainData({ fundraising: localData })}
      >
        <span className="hidden group-hover:inline absolute -top-8 right-0 bg-gray-800 text-white text-sm px-2 py-1 rounded">Save Changes</span>
        Save
      </motion.button>
    </div>
  );
};

FundraisingPage.propTypes = {
  campaignTitle: PropTypes.string,
  campaignDescription: PropTypes.string,
  imageUrl: PropTypes.string,
  fundraiserName: PropTypes.string,
  amountRaised: PropTypes.number,
  goalAmount: PropTypes.number,
  qrCodeUrl: PropTypes.string,
  donors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    }),
  ),
  totalCollected: PropTypes.number,
  totalSpent: PropTypes.number,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
    }),
  ),
};

export default FundraisingPage;