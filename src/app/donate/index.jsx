import React, { useContext, useState } from "react";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import FundraisingHeader from "../../components/FundraisingHeader";
import DonorList from "../../components/DonorList";
import CampaignDetails from "../../components/FundRaisingSection/CampaignDetail";
import { motion } from "framer-motion";
import GlobalContext from "../../GlobalContext";
import SaveFloatingButton from "../../globalComponent/SaveButton/index.jsx";

const FundraisingPage = () => {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    fundraising,
    setFundraising,
    sectionTitles,
    setSectionTitles,
    enqueueImageUpload
  } = useContext(GlobalContext);

  const imagesToPreload = [
    fundraising?.image_url || "https://via.placeholder.com/300",
    fundraising?.qr_code_url || "https://via.placeholder.com/300"
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const [hasChanges, setHasChanges] = useState(false);

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
        sectionTitles={sectionTitles}
        setSectionTitles={setSectionTitles}
      />
      <CampaignDetails
        campaign_title={fundraising?.campaign_title || ""}
        campaign_description={fundraising?.campaign_description || ""}
        setFundraising={setFundraising}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
        sectionTitles={sectionTitles}
        setSectionTitles={setSectionTitles}
      />
      <DonorList
        donors={fundraising?.donors || []}
        setFundraising={setFundraising}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
        sectionTitles={sectionTitles}
        setSectionTitles={setSectionTitles}
      />
    </div>
  );
};

export default FundraisingPage;