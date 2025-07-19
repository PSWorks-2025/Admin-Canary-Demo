// GlobalContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { readData } from "./service/readFirebase.jsx";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage} from "./service/firebaseConfig.jsx";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState();
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState();
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState();
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

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

          // NEW: set footer-specific states
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

  // Data destructuring before passing into each page
  const [logoUrl, setLogoUrl] = useState(globalData?.logo || ''); // always a string URL
  const [logoFile, setLogoFile] = useState(null); // temp File to upload later

  // Footer specific data
  const [groupName, setGroupName] = useState( globalData?.group_name || "");
  const [groupDescription, setGroupDescription] = useState(globalData?.description || "")
  const [contactInfoData, setContactInfoData] = useState({
    hotline: globalData?.hotline || "",
    email: globalData?.email || "",
    address: globalData?.address || "",
  });
  const [socialLinksData, setSocialLinksData] = useState(globalData?.social_media || {});
  

  const updateGlobalData = useCallback(async (updates) => {
    try {
      const updatedData = { ...globalData, ...updates };
      setGlobalData(updatedData);
      const docRef = doc(db, 'Global', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully');
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setGlobalData(globalData);
    }
  }, [globalData, setGlobalData]);

  const handleGlobalSave = useCallback(async () => {
    try {
      const updatedData = {
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

      if (logoFile) {
        const storageRef = ref(storage, `header/${logoFile.name}`);
        await uploadBytes(storageRef, logoFile);
        const url = await getDownloadURL(storageRef);
        setLogoUrl(url);
        updatedData.logo = url;
        setLogoFile(null);
      }

      const docRef = doc(db, "Global", "components");
      await updateDoc(docRef, updatedData);
      setGlobalData(updatedData);
      console.log("Saved all global data!");
    } catch (error) {
      console.error("Error saving global data:", error);
    }
  }, [
    globalData,
    logoFile,
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
    handleGlobalSave,
    groupName, 
    setGroupName,
    groupDescription, 
    setGroupDescription,
    contactInfoData, 
    setContactInfoData,
    socialLinksData, 
    setSocialLinksData,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
