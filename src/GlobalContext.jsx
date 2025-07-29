import { createContext, useState, useEffect, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { db, storage } from './service/firebaseConfig.jsx';
import { readData } from './service/firebaseRead.jsx';
import set from 'lodash/set';
import { createFinalData } from './utils/deepMerge.js';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  // Global and main data
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

  // Theme colors
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState('#ffffff');
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState('#ffffff');
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState('#4160df');

  // Footer-specific states
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [contactInfoData, setContactInfoData] = useState({
    hotline: null,
    email: null,
    address: null,
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

  // useEffect(() => {
  //   console.log(groupName);
  // }, [groupName]);

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const res = await readData();
        if (res?.global) {
          setGlobalData(res.global);
          setLogoUrl(res.global.logo || '');
          setPrimaryBackgroundColor(res.global.primaryBackgroundColor || '#ffffff');
          setSecondaryBackgroundColor(res.global.secondaryBackgroundColor || '#ffffff');
          setTertiaryBackgroundColor(res.global.tertiaryBackgroundColor || '#4160df');
          setGroupName(res.global.group_name || '');
          setGroupDescription(res.global.description || '');
          setContactInfoData({
            hotline: res.global.hotline || null,
            email: res.global.email || null,
            address: res.global.address || null,
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
        console.error('Error in GlobalProvider useEffect:', error);
      } finally {
        setLoading(false);
      }
    };
    handleGetData();
  }, []);

  // Enqueue image with unique key (supports both object and string key signatures)
  const enqueueImageUpload = useCallback((keyOrObj, path, file) => {
    let key;
    if (typeof keyOrObj === 'object' && keyOrObj.key) {
      key = keyOrObj.key;
      path = keyOrObj.path;
      file = keyOrObj.file;
    } else {
      key = keyOrObj;
    }

    if (!key.startsWith('main_pages.') && !key.startsWith('global.')) {
      console.warn(
        `❗ enqueueImageUpload: Key should start with 'main_pages.' or 'global.' Got: ${key}`
      );
    }

    setImageUploadQueue((prev) => ({
      ...prev,
      [key]: { key, path, file },
    }));
  }, []);

  // Upload all queued images and update globalData/mainData
  const uploadAllImagesInQueue = async (baseGlobalUpdate, baseMainUpdate) => {
    const updatedGlobal = { ...baseGlobalUpdate };
    const updatedMain = { ...baseMainUpdate };

    for (const key in imageUploadQueue) {
      const { path, file } = imageUploadQueue[key];
      console.log(path)
      try {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const finalUrl = `${url}?v=${Date.now()}`;
        URL.revokeObjectURL(file); // Clean up blob URL

        let actualKey = key
          .replace(/^globalData\./, '')
          .replace(/^global\./, '')
          .replace(/^mainData\./, '')
          .replace(/^main_pages\./, '')
          .replace(/^main\./, '')
          .replace(/^Main pages\./, '');

        if (
          key.startsWith('global.') ||
          key.startsWith('globalData.') ||
          key.startsWith('Global.')
        ) {
          set(updatedGlobal, actualKey, finalUrl);
          if (actualKey === 'logo') {
            setLogoUrl(finalUrl);
          }
        } else if (
          key.startsWith('main.') ||
          key.startsWith('mainData.') ||
          key.startsWith('Main pages.') ||
          key.startsWith('main_pages.')
        ) {
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

      // Prepare main data with date conversions
      const baseMainUpdate = {
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

      // Upload images and get updated data
      const { updatedGlobal, updatedMain } = await uploadAllImagesInQueue(baseGlobalUpdate, baseMainUpdate);

      // Merge updates
      const finalGlobalData = createFinalData(baseGlobalUpdate, updatedGlobal);
      const finalMainData = createFinalData(baseMainUpdate, updatedMain);

      // Firestore writes
      const globalRef = doc(db, 'Global', 'components');
      const mainRef = doc(db, 'Main pages', 'components');

      await Promise.all([
        setDoc(globalRef, finalGlobalData),
        setDoc(mainRef, finalMainData),
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

      console.log('✅ Global and Main data saved successfully!');
    } catch (error) {
      console.error('❌ Error saving global/main data:', error);
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