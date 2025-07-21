// GlobalContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./service/firebaseConfig.jsx";
import { readData } from "./service/readFirebase.jsx";
import set from "lodash/set";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState();
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState();
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState();
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

  // Footer-specific states
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [contactInfoData, setContactInfoData] = useState({
    hotline: "",
    email: "",
    address: "",
  });
  const [socialLinksData, setSocialLinksData] = useState({});

  const [imageUploadQueue, setImageUploadQueue] = useState({});

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const res = await readData();
        if (res?.global) {
          setGlobalData(res.global);
          setLogoUrl(res.global.logo || '');
          setPrimaryBackgroundColor(res.global.primaryBackgroundColor || "#ffffff");
          setSecondaryBackgroundColor(res.global.secondaryBackgroundColor || "#ffffff");
          setTertiaryBackgroundColor(res.global.tertiaryBackgroundColor || "#4160df");
          setGroupName(res.global.group_name || "");
          setGroupDescription(res.global.description || "");
          setContactInfoData({
            hotline: res.global.hotline || "",
            email: res.global.email || "",
            address: res.global.address || "",
          });
          setSocialLinksData(res.global.social_media || {});
        }
        if (res?.main) {
          setMainData(res.main);
        }
      } catch (error) {
        console.error("Error in GlobalProvider useEffect:", error);
      } finally {
        setLoading(false);
      }
    };
    handleGetData();
  }, []);

  // ✅ Enqueue image with unique key (dynamic field path in globalData)
  const enqueueImageUpload = (key, path, file) => {
    setImageUploadQueue((prev) => ({
      ...prev,
      [key]: { key, path, file }
    }));
  };

  // ✅ Upload all queued images and update globalData
  const uploadAllImagesInQueue = async () => {
    const updated = { ...globalData };

    for (const key in imageUploadQueue) {
      const { path, file } = imageUploadQueue[key];
      try {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const finalUrl = `${url}?v=${Date.now()}`;
        set(updated, key, finalUrl); // dynamic set using lodash.set

        // Optional: set logoUrl state if it's logo
        if (key === "logo" || key === "globalData.logo") {
          setLogoUrl(finalUrl);
        }
      } catch (error) {
        console.error(`Error uploading image at ${path}:`, error);
      }
    }

    setImageUploadQueue({});
    return updated;
  };

  const updateGlobalData = useCallback(async (updates) => {
    try {
      const updatedData = { ...globalData, ...updates };
      setGlobalData(updatedData);
      const docRef = doc(db, 'Global', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully');
    } catch (error) {
      console.error('Error updating Firestore:', error);
    }
  }, [globalData]);

  const handleGlobalSave = useCallback(async () => {
    try {
      const baseUpdate = {
        ...globalData,
        primaryBackgroundColor,
        secondaryBackgroundColor,
        tertiaryBackgroundColor,
        group_name: groupName,
        description: groupDescription,
        hotline: contactInfoData.hotline,
        email: contactInfoData.email,
        address: contactInfoData.address,
        social_media: socialLinksData,
      };

      const imageUpdatedGlobal = await uploadAllImagesInQueue();
      const finalData = { ...baseUpdate, ...imageUpdatedGlobal };

      const docRef = doc(db, "Global", "components");
      await updateDoc(docRef, finalData);
      setGlobalData(finalData);
      console.log("✅ Global data and image URLs saved successfully!");
    } catch (error) {
      console.error("❌ Error saving global data:", error);
    }
  }, [
    globalData,
    imageUploadQueue,
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
    groupName,
    groupDescription,
    contactInfoData,
    socialLinksData,
  ]);

  const contextValue = {
    loading,
    globalData,
    setGlobalData,
    mainData,
    setMainData,
    primaryBackgroundColor,
    setPrimaryBackgroundColor,
    secondaryBackgroundColor,
    setSecondaryBackgroundColor,
    tertiaryBackgroundColor,
    setTertiaryBackgroundColor,
    logoUrl,
    setLogoUrl,
    logoFile,
    setLogoFile,
    groupName,
    setGroupName,
    groupDescription,
    setGroupDescription,
    contactInfoData,
    setContactInfoData,
    socialLinksData,
    setSocialLinksData,
    handleGlobalSave,
    enqueueImageUpload,
    imageUploadQueue,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
