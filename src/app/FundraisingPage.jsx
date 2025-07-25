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
    fundraising?.image_url || "https://picsum.photos/800/400",
    fundraising?.qr_code_url || "https://picsum.photos/500",
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const updateField = (field, value) => {
    setFundraising((prev) => ({
      ...prev,
      [field]: field === "goal_amount" || field === "amount_raised" ? Number(value) || 0 : value,
    }));
  };

  const updateImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `fundraising/${file.name}`;
      enqueueImageUpload(`main.fundraising.${field}`, storagePath, file);
      setFundraising((prev) => ({ ...prev, [field]: blobUrl }));
    }
  };

  const updateDonor = (index, field, value) => {
    setFundraising((prev) => {
      const newDonors = [...prev.donors];
      newDonors[index] = {
        ...newDonors[index],
        [field]: field === "amount" ? Number(value) || 0 : value,
      };
      return {
        ...prev,
        donors: newDonors,
        amount_raised: newDonors.reduce((sum, donor) => sum + (donor.amount || 0), 0),
      };
    });
  };

  const addDonor = () => {
    const newId =
      fundraising.donors.length > 0
        ? Math.max(...fundraising.donors.map((donor) => donor.id || 0)) + 1
        : 1;
    setFundraising((prev) => ({
      ...prev,
      donors: [...prev.donors, { id: newId, name: "", amount: 0 }],
    }));
  };

  const deleteDonor = (index) => {
    setFundraising((prev) => {
      const newDonors = prev.donors.filter((_, i) => i !== index);
      return {
        ...prev,
        donors: newDonors,
        amount_raised: newDonors.reduce((sum, donor) => sum + (donor.amount || 0), 0),
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
        imageUrl={fundraising?.image_url}
        fundraiserName={fundraising?.fundraiser_name}
        amountRaised={fundraising?.amount_raised}
        goalAmount={fundraising?.goal_amount}
        qrCodeUrl={fundraising?.qr_code_url}
        onSupportClick={handleSupportClick}
        onFieldChange={updateField}
        onImageUpload={updateImage}
        buttonColor={secondaryBackgroundColor}
      />
      <CampaignDetails
        campaignTitle={fundraising?.campaign_title}
        campaignDescription={fundraising?.campaign_description}
        onFieldChange={updateField}
        buttonColor={secondaryBackgroundColor}
      />
      <DonorList
        donors={fundraising?.donors}
        onDonorChange={updateDonor}
        onAddDonor={addDonor}
        onDeleteDonor={deleteDonor}
        buttonColor={secondaryBackgroundColor}
      />
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
    })
  ),
};

export default FundraisingPage;