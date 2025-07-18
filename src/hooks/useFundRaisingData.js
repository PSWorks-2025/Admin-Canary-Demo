import { useState, useEffect, useCallback } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { db,storage } from "../service/firebaseConfig";
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const useFundraisingData = (mainData, setMainData) => {
  const [localData, setLocalData] = useState({
    campaignTitle: mainData.fundraising?.campaign_title || "",
    campaignDescription: mainData.fundraising?.campaign_description || "",
    fundraiserName: mainData.fundraising?.fundraiser_name || "",
    imageUrl: mainData.fundraising?.image_url || "https://picsum.photos/800/400",
    qrCodeUrl: mainData.fundraising?.qr_code_url || "https://picsum.photos/500",
    amountRaised: mainData.fundraising?.amount_raised || 0,
    goalAmount: mainData.fundraising?.goal_amount || 0,
    donors: (mainData.fundraising?.donors || []).map(donor => ({
      ...donor,
      id: donor.id || Math.random().toString(36).substr(2, 9),
    })),
    totalCollected: mainData.fundraising?.total_collected || 0,
    totalSpent: mainData.fundraising?.total_spent || 0,
    transactions: (mainData.fundraising?.transactions || []).map(tx => ({
      ...tx,
      date: tx.date instanceof Timestamp ? tx.date.toDate().toISOString().split("T")[0] : tx.date || "",
    })),
  });

  // Sync localData with mainData changes
  useEffect(() => {
    setLocalData(prev => ({
      ...prev,
      campaignTitle: mainData.fundraising?.campaign_title || prev.campaignTitle,
      campaignDescription: mainData.fundraising?.campaign_description || prev.campaignDescription,
      fundraiserName: mainData.fundraising?.fundraiser_name || prev.fundraiserName,
      imageUrl: mainData.fundraising?.image_url || prev.imageUrl,
      qrCodeUrl: mainData.fundraising?.qr_code_url || prev.qrCodeUrl,
      amountRaised: mainData.fundraising?.amount_raised || prev.amountRaised,
      goalAmount: mainData.fundraising?.goal_amount || prev.goalAmount,
      donors: (mainData.fundraising?.donors || prev.donors).map(donor => ({
        ...donor,
        id: donor.id || Math.random().toString(36).substr(2, 9),
      })),
      totalCollected: mainData.fundraising?.total_collected || prev.totalCollected,
      totalSpent: mainData.fundraising?.total_spent || prev.totalSpent,
      transactions: (mainData.fundraising?.transactions || prev.transactions).map(tx => ({
        ...tx,
        date: tx.date instanceof Timestamp ? tx.date.toDate().toISOString().split("T")[0] : tx.date || "",
      })),
    }));
  }, [mainData.fundraising]);

  // Calculate totals
  useEffect(() => {
    const amountRaised = localData.donors.reduce((sum, donor) => sum + (donor.amount || 0), 0);
    const totalCollected = localData.transactions
      .filter(tx => tx.type === "Thu")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const totalSpent = localData.transactions
      .filter(tx => tx.type === "Chi")
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);

    if (
      amountRaised !== localData.amountRaised ||
      totalCollected !== localData.totalCollected ||
      totalSpent !== localData.totalSpent
    ) {
      setLocalData(prev => ({
        ...prev,
        amountRaised,
        totalCollected,
        totalSpent,
      }));
      debouncedUpdateMainData({
        fundraising: {
          ...mainData.fundraising,
          amount_raised: amountRaised,
          total_collected: totalCollected,
          total_spent: totalSpent,
        },
      });
    }
  }, [localData.donors, localData.transactions]);

  // Normalize transactions.date to Timestamps
  useEffect(() => {
    if (mainData.fundraising?.transactions?.some(tx => tx.date && !(tx.date instanceof Timestamp))) {
      const normalizedTransactions = mainData.fundraising.transactions.map(tx => ({
        ...tx,
        date: tx.date && typeof tx.date === "string" ? Timestamp.fromDate(new Date(tx.date)) : tx.date || null,
      }));
      updateMainData({ fundraising: { ...mainData.fundraising, transactions: normalizedTransactions } });
    }
  }, [mainData.fundraising]);

  const mergeNested = useCallback((target, source) => {
    const output = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) && !(source[key] instanceof Timestamp) && !(source[key] instanceof Date)) {
        output[key] = mergeNested(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }, []);

  const updateMainData = async (updates) => {
    try {
      let updatedData;
      setMainData((prev) => {
        updatedData = mergeNested(prev, updates);
        return updatedData;
      });
      const docRef = doc(db, "Main pages", "components");
      await updateDoc(docRef, updatedData);
    } catch (error) {
      console.error("Error updating Firestore:", error);
      setMainData(mainData); // Revert on error
    }
  };

  const debouncedUpdateMainData = useCallback(debounce(updateMainData, 1000), [mainData, setMainData]);

  const handleFieldChange = useCallback(async (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: field === "goalAmount" ? Number(value) || 0 : value }));
    await debouncedUpdateMainData({
      fundraising: {
        ...mainData.fundraising,
        [field === "campaignTitle" ? "campaign_title" :
         field === "campaignDescription" ? "campaign_description" :
         field === "fundraiserName" ? "fundraiser_name" :
         field === "goalAmount" ? "goal_amount" : field]: field === "goalAmount" ? Number(value) || 0 : value,
      },
    });
  }, [mainData.fundraising, debouncedUpdateMainData]);

  const handleImageUpload = useCallback(async (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `fundraising/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        setLocalData(prev => ({ ...prev, [field]: downloadUrl }));
        await updateMainData({
          fundraising: {
            ...mainData.fundraising,
            [field === "imageUrl" ? "image_url" : "qr_code_url"]: downloadUrl,
          },
        });
      } catch (error) {
        console.error(`Error uploading image for ${field}:`, error);
      }
    }
  }, [mainData.fundraising]);

  const handleDonorChange = useCallback(async (index, field, value) => {
    const newDonors = [...localData.donors];
    newDonors[index] = { ...newDonors[index], [field]: field === "amount" ? Number(value) || 0 : value };
    setLocalData(prev => ({ ...prev, donors: newDonors }));
    await debouncedUpdateMainData({
      fundraising: {
        ...mainData.fundraising,
        donors: newDonors,
      },
    });
  }, [localData.donors, mainData.fundraising, debouncedUpdateMainData]);

  const addDonor = useCallback(async () => {
    const newId = localData.donors.length > 0
      ? Math.max(...localData.donors.map(donor => donor.id || 0)) + 1
      : 1;
    const newDonor = { id: newId, name: "", amount: 0 };
    setLocalData(prev => ({ ...prev, donors: [...prev.donors, newDonor] }));
    await updateMainData({
      fundraising: {
        ...mainData.fundraising,
        donors: [...(mainData.fundraising?.donors || []), newDonor],
      },
    });
  }, [localData.donors, mainData.fundraising]);

  const deleteDonor = useCallback(async (index) => {
    const newDonors = localData.donors.filter((_, i) => i !== index);
    setLocalData(prev => ({ ...prev, donors: newDonors }));
    await updateMainData({
      fundraising: {
        ...mainData.fundraising,
        donors: newDonors,
      },
    });
  }, [localData.donors, mainData.fundraising]);

  return {
    localData,
    setLocalData,
    handleFieldChange,
    handleImageUpload,
    handleDonorChange,
    addDonor,
    deleteDonor,
    updateMainData,
  };
};

export default useFundraisingData;