// GlobalContext.jsx
import { createContext, useState, useEffect, useCallback } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./service/firebaseConfig.jsx";
import { readData } from "./service/readFirebase.jsx";
import set from "lodash/set";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Global and main data
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});

  const [loading, setLoading] = useState(true);

  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState();
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState();
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState();

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

  // Main data states for the main pages
  const [activityHistory, setActivityHistory] = useState([]);
  const [eventOverviews, setEventOverviews] = useState({});
  const [fundraising, setFundraising] = useState({});
  const [heroSections, setHeroSections] = useState({});
  const [highlights, setHighlights] = useState({});
  const [members, setMembers] = useState([]);
  const [orgStats, setOrgStats] = useState({});
  const [projectOverviews, setProjectOverviews] = useState({});
  const [statements, setStatements] = useState({});
  const [storyOverviews, setStoryOverviews] = useState({});


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
          setActivityHistory(res.main.activity_history || []);
          setEventOverviews(res.main.event_overviews || {});
          setFundraising(res.main.fundraising || {});
          setHeroSections(res.main.hero_sections || {});
          setHighlights(res.main.highlights || {});
          setMembers(res.main.members || []);
          setOrgStats(res.main.org_stats || {});
          setProjectOverviews(res.main.project_overviews || {});
          setStatements(res.main.statements || {});
          setStoryOverviews(res.main.story_overviews || {});
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
  const updatedGlobal = { ...globalData };
  const updatedMain = { ...mainData };

  for (const key in imageUploadQueue) {
    const { path, file } = imageUploadQueue[key];
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      const finalUrl = `${url}?v=${Date.now()}`;

      if (key.startsWith("global.") || key.startsWith("globalData.") || key.startsWith("Global.")) {
        const actualKey = key.replace("global.", "");
        set(updatedGlobal, actualKey, finalUrl);

        // Optional: update local state (e.g., logo preview)
        if (actualKey === "logo") {
          setLogoUrl(finalUrl);
        }
      } else if (key.startsWith("main.") || key.startsWith("mainData.") || key.startsWith("Main pages.")) {
        const actualKey = key.replace("main.", "");
        set(updatedMain, actualKey, finalUrl);
      } else {
        console.warn(`❗ Unknown key prefix: ${key}`);
      }
    } catch (error) {
      console.error(`❌ Error uploading image at ${path}:`, error);
    }
  }

  setImageUploadQueue({});
  return { updatedGlobal, updatedMain };
};


  const handleGlobalSave = async () => {
  try {
    // Global data
    const baseGlobalUpdate = {
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
    const finalGlobalData = { ...baseGlobalUpdate, ...imageUpdatedGlobal };

    // Main data
    const finalMainData = {
      activity_history: activityHistory,
      event_overviews: eventOverviews,
      fundraising: fundraising,
      hero_sections: heroSections,
      highlights: highlights,
      members: members,
      org_stats: orgStats,
      project_overviews: projectOverviews,
      statements: statements,
      story_overviews: storyOverviews,
    };

    // Firestore writes
    const globalRef = doc(db, 'Global', 'components');
    const mainRef = doc(db, 'Main pages', 'components');

    await Promise.all([
      updateDoc(globalRef, finalGlobalData),
      updateDoc(mainRef, finalMainData),
    ]);

    setGlobalData(finalGlobalData);
    setMainData(finalMainData); // if you're still using setMainData for backup

    console.log("✅ Global and Main data saved successfully!");
  } catch (error) {
    console.error("❌ Error saving global/main data:", error);
  }
};


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
    
    // main data
    activityHistory,
    setActivityHistory,
    eventOverviews,
    setEventOverviews,
    fundraising,
    setFundraising,
    heroSections,
    setHeroSections,
    highlights,
    setHighlights,
    members,
    setMembers,
    orgStats,
    setOrgStats,
    projectOverviews,
    setProjectOverviews,
    statements,
    setStatements,
    storyOverviews,
    setStoryOverviews,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
