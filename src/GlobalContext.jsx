import { createContext, useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { db, storage } from "./service/firebaseConfig.jsx";
import { readData } from "./service/readFirebase.jsx";

// Custom function to set nested object values
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = current[keys[i]] || {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
};

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Global and main data
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

  // Theme colors
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState("#ffffff");
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState("#ffffff");
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState("#4160df");

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

  // Image upload queue
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

  // Enqueue image with unique key (dynamic field path in globalData or mainData)
  const enqueueImageUpload = (key, path, file) => {
    setImageUploadQueue((prev) => ({
      ...prev,
      [key]: { key, path, file }
    }));
  };

  // Upload all queued images and update globalData/mainData
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
          const actualKey = key.replace(/^global[Data.]?\./i, "");
          setNestedValue(updatedGlobal, actualKey, finalUrl);
          if (actualKey === "logo") {
            setLogoUrl(finalUrl);
          }
        } else if (key.startsWith("main.") || key.startsWith("mainData.") || key.startsWith("Main pages.")) {
          const actualKey = key.replace(/^main[Data.]?\./i, "");
          setNestedValue(updatedMain, actualKey, finalUrl);
        } else {
          console.warn(`❗ Unknown key prefix: ${key}`);
        }
        URL.revokeObjectURL(file); // Clean up blob URL
      } catch (error) {
        console.error(`❌ Error uploading image at ${path}:`, error);
      }
    }

    setImageUploadQueue({});
    return { updatedGlobal, updatedMain };
  };

  const handleGlobalSave = async () => {
    try {
      // Prepare global data
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

      // Upload images and get updated data
      const { updatedGlobal, updatedMain } = await uploadAllImagesInQueue();
      const finalGlobalData = { ...baseGlobalUpdate, ...updatedGlobal };

      // Prepare main data with date conversions
      const finalMainData = {
        activity_history: activityHistory.map((activity) => ({
          ...activity,
          started_time:
            activity.started_time && !isNaN(new Date(activity.started_time).getTime())
              ? Timestamp.fromDate(new Date(activity.started_time))
              : null,
          ended_time:
            activity.ended_time && !isNaN(new Date(activity.ended_time).getTime())
              ? Timestamp.fromDate(new Date(activity.ended_time))
              : null,
        })),
        event_overviews: eventOverviews,
        fundraising: {
          ...fundraising,
          amount_raised: fundraising.donors
            ? fundraising.donors.reduce((sum, donor) => sum + (donor.amount || 0), 0)
            : 0,
        },
        hero_sections: heroSections,
        highlights: highlights,
        members: members,
        org_stats: orgStats,
        project_overviews: Object.entries(projectOverviews).reduce((acc, [key, project]) => ({
          ...acc,
          [key]: {
            ...project,
            started_time:
              project.started_time && !isNaN(new Date(project.started_time).getTime())
                ? Timestamp.fromDate(new Date(project.started_time))
                : null,
          },
        }), {}),
        statements: statements,
        story_overviews: Object.entries(storyOverviews).reduce((acc, [key, story]) => ({
          ...acc,
          [key]: {
            ...story,
            posted_time:
              story.posted_time && !isNaN(new Date(story.posted_time).getTime())
                ? Timestamp.fromDate(new Date(story.posted_time))
                : null,
          },
        }), {}),
      };

      // Firestore writes
      const globalRef = doc(db, 'Global', 'components');
      const mainRef = doc(db, 'Main pages', 'components');

      await Promise.all([
        updateDoc(globalRef, finalGlobalData),
        updateDoc(mainRef, finalMainData),
      ]);

      // Update local state
      setGlobalData(finalGlobalData);
      setMainData(finalMainData);
      setActivityHistory(finalMainData.activity_history);
      setEventOverviews(finalMainData.event_overviews);
      setFundraising(finalMainData.fundraising);
      setHeroSections(finalMainData.hero_sections);
      setHighlights(finalMainData.highlights);
      setMembers(finalMainData.members);
      setOrgStats(finalMainData.org_stats);
      setProjectOverviews(finalMainData.project_overviews);
      setStatements(finalMainData.statements);
      setStoryOverviews(finalMainData.story_overviews);

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
    // Main data
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