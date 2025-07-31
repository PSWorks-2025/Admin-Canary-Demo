import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import FundraisingHeader from "../../components/FundraisingHeader";
import DonorList from "../../components/DonorList";
import CampaignDetails from "../../components/FundRaisingSection/CampaignDetail";
import { motion } from "framer-motion";
import GlobalContext from "../../GlobalContext";

const FundraisingPage = () => {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    fundraising,
    setFundraising,
    enqueueImageUpload,
    handleGlobalSave,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    fundraising?.image_url || "https://via.placeholder.com/300",
    fundraising?.qr_code_url || "https://via.placeholder.com/300",
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const [hasChanges, setHasChanges] = useState(false);

  const handleSupportClick = () => {
    alert("Cảm ơn bạn đã ủng hộ! 🎉");
  };

  const handleSave = () => {
    console.log("FundraisingPage: Triggering handleGlobalSave");
    handleGlobalSave();
    setHasChanges(false); // Reset hasChanges after saving
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
        image_url={fundraising?.image_url || "https://via.placeholder.com/300"}
        fundraiser_name={fundraising?.fundraiser_name || ""}
        amount_raised={fundraising?.amount_raised || 0}
        goal_amount={fundraising?.goal_amount || 0}
        qr_code_url={fundraising?.qr_code_url || "https://via.placeholder.com/300"}
        onSupportClick={handleSupportClick}
        setFundraising={setFundraising}
        enqueueImageUpload={enqueueImageUpload}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
      />
      <CampaignDetails
        campaign_title={fundraising?.campaign_title || ""}
        campaign_description={fundraising?.campaign_description || ""}
        setFundraising={setFundraising}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
      />
      <DonorList
        donors={fundraising?.donors || []}
        setFundraising={setFundraising}
        setHasChanges={setHasChanges}
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