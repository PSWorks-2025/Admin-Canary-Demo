import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Timestamp } from 'firebase/firestore';
import { db, storage } from './service/firebaseConfig.jsx';
import { readData } from './service/firebaseRead.jsx';
import set from 'lodash/set';
import { createFinalData } from './utils/deepMerge.js';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

  // Theme colors
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState('#ffffff');
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState('#4160df');
  const [tertitaryBackgroundColor, setTertiaryBackgroundColor] = useState('#fff');

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
  const [imageUploadQueue, setImageUploadQueue] = useState({});
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
  const [sectionTitles, setSectionTitles] = useState({
    members: 'Thành viên',
    activity_history: 'Lịch sử hoạt động',
    stories: 'Câu chuyện',
    projects: 'Dự án & hoạt động nổi bật đã thực hiện',
    fundraising_header: 'Quỹ Gây Quỹ',
    campaign_details: 'Chi Tiết Chiến Dịch',
    donor_list: 'Danh Sách Ủng Hộ',
    events: 'Sự kiện',
  });

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const res = await readData();
        if (res?.global) {
          setGlobalData(res.global);
          setLogoUrl(res.global.logo || '');
          setPrimaryBackgroundColor(
            res.global.primaryBackgroundColor || '#ffffff'
          );
          setSecondaryBackgroundColor(
            res.global.secondaryBackgroundColor || '#4160df'
          );
          setTertiaryBackgroundColor(
            res.global.secondaryBackgroundColor || '#ffffff'
          );
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
          setActivityHistory(
            res.main.activity_history?.map((activity) => ({
              ...activity,
              started_time: activity.started_time?.toDate()
                ? activity.started_time.toDate()
                : activity.started_time || null,
              ended_time: activity.ended_time?.toDate()
                ? activity.ended_time.toDate()
                : activity.ended_time || null,
            }) || []
          ));
          setEventOverviews(res.main.event_overviews || {});
          setFundraising(res.main.fundraising || {});
          setHeroSections(res.main.hero_sections || {});
          setHighlights(res.main.highlights || {});
          setMembers(res.main.members || []);
          setOrgStats(res.main.org_stats || {});
          setProjectOverviews(
            Object.entries(res.main.project_overviews || {}).reduce((acc, [key, project]) => {
              acc[key] = {
                ...project,
                started_time: project.started_time?.toDate
                  ? project.started_time.toDate()
                  : project.started_time || null,
              };
              return acc;
            }, {})
          );
          setStatements(res.main.statements || {});
          setStoryOverviews(res.main.story_overviews || {});
          setSectionTitles({
            members: res.main.section_titles?.members || 'Thành viên',
            activity_history: res.main.section_titles?.activity_history || 'Lịch sử hoạt động',
            stories: res.main.section_titles?.stories || 'Câu chuyện',
            projects: res.main.section_titles?.projects || 'Dự án & hoạt động nổi bật đã thực hiện',
            fundraising_header: res.main.section_titles?.fundraising_header || 'Quỹ Gây Quỹ',
            campaign_details: res.main.section_titles?.campaign_details || 'Chi Tiết Chiến Dịch',
            donor_list: res.main.section_titles?.donor_list || 'Danh Sách Ủng Hộ',
            events: res.main.section_titles?.events || 'Sự kiện',
          });
        }
      } catch (error) {
        console.error('Error in GlobalProvider useEffect:', error);
      } finally {
        setLoading(false);
      }
    };
    handleGetData();
  }, []);

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

  const uploadAllImagesInQueue = async (baseGlobalUpdate, baseMainUpdate) => {
    const updatedGlobal = { ...baseGlobalUpdate };
    const updatedMain = { ...baseMainUpdate };

    for (const key in imageUploadQueue) {
      const { path, file } = imageUploadQueue[key];
      try {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        const finalUrl = `${url}?v=${Date.now()}`;
        URL.revokeObjectURL(file);

        let actualKey = key
          .replace(/^globalData\./, '')
          .replace(/^global\./, '')
          .replace(/^mainData\./, '')
          .replace(/^main_pages\./, '')
          .replace(/^main\./, '')
          .replace(/^Main pages\./, '');

        if (key.startsWith('global.') || key.startsWith('globalData.')) {
          set(updatedGlobal, actualKey, finalUrl);
          if (actualKey === 'logo') {
            setLogoUrl(finalUrl);
          }
        } else if (key.startsWith('main.') || key.startsWith('main_pages.')) {
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
      const baseGlobalUpdate = {
        ...globalData,
        primaryBackgroundColor,
        secondaryBackgroundColor,
        tertitaryBackgroundColor,
        group_name: groupName,
        description: groupDescription,
        hotline: contactInfoData.hotline,
        email: contactInfoData.email,
        address: contactInfoData.address,
        social_media: socialLinksData,
      };

      const baseMainUpdate = {
        activity_history: activityHistory.map((activity) => {
          console.log('Saving activity_history:', { started_time: activity.started_time, ended_time: activity.ended_time });
          return {
            ...activity,
            started_time:
              activity.started_time && !isNaN(new Date(activity.started_time).getTime())
                ? Timestamp.fromDate(new Date(activity.started_time))
                : activity.started_time || null, // Preserve existing Timestamp if valid
            ended_time:
              activity.ended_time && !isNaN(new Date(activity.ended_time).getTime())
                ? Timestamp.fromDate(new Date(activity.ended_time))
                : activity.ended_time || null, // Preserve existing Timestamp if valid
          };
        }),
        event_overviews: Object.entries(eventOverviews).reduce((acc, [key, event]) => {
          acc[key] = {
            ...event,
            title: event.title || '',
            abstract: event.abstract || '',
            thumbnail: {
              src: event.thumbnail?.src || 'https://via.placeholder.com/300',
              alt: event.thumbnail?.alt || '',
              caption: event.thumbnail?.caption || '',
            },
            started_time:
              event.started_time && !isNaN(new Date(event.started_time).getTime())
                ? Timestamp.fromDate(new Date(event.started_time))
                : event.started_time || null,
          };
          return acc;
        }, {}),
        fundraising: {
          ...fundraising,
          fundraiser_name: fundraising.fundraiser_name || '',
          campaign_title: fundraising.campaign_title || '',
          campaign_description: fundraising.campaign_description || '',
          image_url: fundraising.image_url || 'https://via.placeholder.com/300',
          qr_code_url: fundraising.qr_code_url || 'https://via.placeholder.com/300',
          goal_amount: Number(fundraising.goal_amount) || 0,
          amount_raised: Number(fundraising.amount_raised) || 0,
          donors: Array.isArray(fundraising.donors)
            ? fundraising.donors.map((donor) => ({
                id: donor.id || `donor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                name: donor.name || '',
                amount: Number(donor.amount) || 0,
              }))
            : [],
        },
        hero_sections: heroSections,
        highlights: highlights,
        members: members,
        org_stats: orgStats,
        project_overviews: Object.entries(projectOverviews).reduce((acc, [key, project]) => {
          console.log('Saving project_overviews:', { key, started_time: project.started_time });
          acc[key] = {
            ...project,
            title: project.title || '',
            abstract: project.abstract || '',
            thumbnail: {
              src: project.thumbnail?.src || 'https://via.placeholder.com/300',
              alt: project.thumbnail?.alt || '',
              caption: project.thumbnail?.caption || '',
            },
            started_time:
              project.started_time && !isNaN(new Date(project.started_time).getTime())
                ? Timestamp.fromDate(new Date(project.started_time))
                : project.started_time || null, // Preserve existing Timestamp if valid
          };
          return acc;
        }, {}),
        statements: statements,
        story_overviews: Object.entries(storyOverviews).reduce((acc, [key, story]) => {
          acc[key] = {
            ...story,
            title: story.title || '',
            abstract: story.abstract || '',
            thumbnail: {
              src: story.thumbnail?.src || 'https://via.placeholder.com/300',
              alt: story.thumbnail?.alt || '',
              caption: story.thumbnail?.caption || '',
            },
            posted_time:
              story.posted_time && !isNaN(new Date(story.posted_time).getTime())
                ? Timestamp.fromDate(new Date(story.posted_time))
                : story.posted_time || null,
          };
          return acc;
        }, {}),
        section_titles: {
          members: sectionTitles.members || 'Thành viên',
          activity_history: sectionTitles.activity_history || 'Lịch sử hoạt động',
          stories: sectionTitles.stories || 'Câu chuyện',
          projects: sectionTitles.projects || 'Dự án & hoạt động nổi bật đã thực hiện',
          fundraising_header: sectionTitles.fundraising_header || 'Quỹ Gây Quỹ',
          campaign_details: sectionTitles.campaign_details || 'Chi Tiết Chiến Dịch',
          donor_list: sectionTitles.donor_list || 'Danh Sách Ủng Hộ',
          events: sectionTitles.events || 'Sự kiện',
        },
      };

      const { updatedGlobal, updatedMain } = await uploadAllImagesInQueue(baseGlobalUpdate, baseMainUpdate);
      const finalGlobalData = createFinalData(baseGlobalUpdate, updatedGlobal);
      const finalMainData = createFinalData(baseMainUpdate, updatedMain);

      const globalRef = doc(db, 'Global', 'components');
      const mainRef = doc(db, 'Main pages', 'components');

      console.log('Saving event_overviews:', finalMainData.event_overviews);
      console.log('Saving activity_history:', finalMainData.activity_history);
      console.log('Saving project_overviews:', finalMainData.project_overviews);

      await Promise.all([
        setDoc(globalRef, finalGlobalData),
        setDoc(mainRef, finalMainData),
      ]);

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
      setSectionTitles(finalMainData.section_titles);

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
    tertitaryBackgroundColor, 
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
    sectionTitles,
    setSectionTitles,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalContext;
