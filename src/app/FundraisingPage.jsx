import React, { useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";
import useImagePreloader from "../hooks/useImagePreloader";
import LoadingScreen from "../components/screens/LoadingScreen";
import FundraisingHeader from "../components/FundraisingHeader";
import DonorList from "../components/DonorList";
import CampaignDetails from "../components/FundRaisingSection/CampaignDetail";
import { ColorContext } from "../layout";
import { motion } from "framer-motion";
import { db, storage } from "../service/firebaseConfig";
import SaveFloatingButton from "../globalComponent/SaveButton";

const FundraisingPage = ({mainData,setMainData}) => {
  const { primaryBackgroundColor, secondaryBackgroundColor } = useContext(ColorContext);
  const [localData, setLocalData] = useState({
    campaignTitle: "",
    campaignDescription: "",
    fundraiserName: "",
    imageUrl: "https://picsum.photos/800/400",
    qrCodeUrl: "https://picsum.photos/500",
    amountRaised: 0,
    goalAmount: 0,
    donors: [],
  });
  const [pendingImages, setPendingImages] = useState([]); // Array of { field, file, blobUrl }
  const imagesLoaded = useImagePreloader([localData.imageUrl, localData.qrCodeUrl]);

  useEffect(() => {
    const fetchData = async () => {
      const data = mainData.fundraising || {};
          setLocalData({
            campaignTitle: data.campaign_title || "",
            campaignDescription: data.campaign_description || "",
            fundraiserName: data.fundraiser_name || "",
            imageUrl: data.image_url || "https://picsum.photos/800/400",
            qrCodeUrl: data.qr_code_url || "https://picsum.photos/500",
            amountRaised: donors.reduce((sum, donor) => sum + (donor.amount || 0), 0),
            goalAmount: data.goal_amount || 0,
            donors,
          });
        }
    fetchData();
  }, []);

  const updateField = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: field === "goalAmount" ? Number(value) || 0 : value,
    }));
  };

  const updateImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [...prev.filter((img) => img.field !== field), { field, file, blobUrl }]);
      setLocalData((prev) => ({ ...prev, [field]: blobUrl }));
    }
  };

  const updateDonor = (index, field, value) => {
    setLocalData((prev) => {
      const newDonors = [...prev.donors];
      newDonors[index] = { ...newDonors[index], [field]: field === "amount" ? Number(value) || 0 : value };
      return { ...prev, donors: newDonors, amountRaised: newDonors.reduce((sum, donor) => sum + (donor.amount || 0), 0) };
    });
  };

  const addDonor = () => {
    const newId = localData.donors.length > 0 ? Math.max(...localData.donors.map((donor) => donor.id || 0)) + 1 : 1;
    const newDonor = { id: newId, name: "", amount: 0 };
    setLocalData((prev) => ({ ...prev, donors: [...prev.donors, newDonor] }));
  };

  const deleteDonor = (index) => {
    setLocalData((prev) => {
      const newDonors = prev.donors.filter((_, i) => i !== index);
      return { ...prev, donors: newDonors, amountRaised: newDonors.reduce((sum, donor) => sum + (donor.amount || 0), 0) };
    });
  };

  const handleSupportClick = () => {
    alert("Cảm ơn bạn đã ủng hộ! 🎉");
  };

  const saveChanges = async () => {
    try {
      // Upload pending images to Firebase Storage
      const imageUpdates = {};
      for (const { field, file } of pendingImages) {
        const storageRef = ref(storage, `fundraising/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUpdates[field] = downloadUrl;
        URL.revokeObjectURL(localData[field]); // Clean up Blob URL
      }

      // Update localData with final image URLs
      setLocalData((prev) => ({ ...prev, ...imageUpdates }));
      setPendingImages([]); // Clear pending images

      // Save to Firestore
      const docRef = doc(db, "Main pages", "components");
      await updateDoc(docRef, {
        fundraising: {
          campaign_title: localData.campaignTitle,
          campaign_description: localData.campaignDescription,
          fundraiser_name: localData.fundraiserName,
          image_url: imageUpdates.imageUrl || localData.imageUrl,
          qr_code_url: imageUpdates.qrCodeUrl || localData.qrCodeUrl,
          amount_raised: localData.amountRaised,
          goal_amount: localData.goalAmount,
          donors: localData.donors,
        },
      });
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
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
        onFieldChange={updateField}
        onImageUpload={updateImage}
        buttonColor={secondaryBackgroundColor}
      />
      <CampaignDetails
        campaignTitle={localData.campaignTitle}
        campaignDescription={localData.campaignDescription}
        onFieldChange={updateField}
        buttonColor={secondaryBackgroundColor}
      />
      <DonorList
        donors={localData.donors}
        onDonorChange={updateDonor}
        onAddDonor={addDonor}
        onDeleteDonor={deleteDonor}
        buttonColor={secondaryBackgroundColor}
      />
      <SaveFloatingButton visible={true} onSave={saveChanges} />
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