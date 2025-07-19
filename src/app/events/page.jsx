import React, { useRef, useContext, useEffect, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import HeroSection from '../../components/EventsSection/HeroSection/index.jsx';
import DonateOverview from '../../components/DonateOverview/DonateOverview';
import ProjectOverview from '../../components/projectOverview/ProjectOverview';
import ProjectLayout from '../../components/ProjectLayout/ProjectLayout';
import EventsOverview from '../../components/EventsOverview/EventsOverview';
import './styles.css';
import { db, storage } from '../../service/firebaseConfig.jsx';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import GlobalContext from '../../GlobalData.jsx';

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function Events() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
    mainData,
    setMainData,
  } = useContext(GlobalContext);

  // Normalize project_overviews to ensure Timestamps
  useEffect(() => {
    if (
      mainData.project_overviews &&
      Object.values(mainData.project_overviews).some(
        (project) =>
          project.started_time && !(project.started_time instanceof Timestamp)
      )
    ) {
      const normalizedProjects = Object.entries(
        mainData.project_overviews
      ).reduce(
        (acc, [key, project]) => ({
          ...acc,
          [key]: {
            ...project,
            started_time:
              project.started_time instanceof Date
                ? Timestamp.fromDate(project.started_time)
                : project.started_time || null,
          },
        }),
        {}
      );
      updateData({ project_overviews: normalizedProjects });
    }
    console.log('mainData.project_overviews:', mainData.project_overviews);
  }, [mainData.project_overviews]);

  // Merge utility for nested objects
  const mergeNested = useCallback((target, source) => {
    const output = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        !(source[key] instanceof Timestamp) &&
        !(source[key] instanceof Date)
      ) {
        output[key] = mergeNested(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }, []);

  const updateData = async (updates) => {
    try {
      let updatedData;
      setMainData((prev) => {
        updatedData = mergeNested(prev, updates);
        console.log('setMainData called with:', updatedData);
        return updatedData;
      });
      const docRef = doc(db, 'Main pages', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully:', updatedData);
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setMainData(mainData);
    }
  };

  // Debounced updateData
  const debouncedUpdateData = useCallback(debounce(updateData, 500), [
    mainData,
    setMainData,
  ]);

  const updateHeroField = async (field, value) => {
    console.log('updateHeroField:', { field, value });
    await debouncedUpdateData({
      hero_sections: {
        ...mainData.hero_sections,
        events: { ...mainData.hero_sections.events, [field]: value },
      },
    });
  };

  const uploadHeroImage = async (file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/events/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateData({
          hero_sections: {
            ...mainData.hero_sections,
            events: { ...mainData.hero_sections.events, image: downloadUrl },
          },
        });
      } catch (error) {
        console.error('Error uploading hero image:', error);
      }
    } else {
      console.error('Invalid file for hero image:', file);
    }
  };

  const updateProjectField = async (field, value) => {
    console.log('updateProjectField:', { field, value });
    const projectKey =
      Object.keys(mainData.project_overviews)[0] ||
      `Dự Án_0_${new Date().toISOString()}`;
    await debouncedUpdateData({
      project_overviews: {
        ...mainData.project_overviews,
        [projectKey]: {
          ...(mainData.project_overviews[projectKey] || {
            title: '',
            abstract: '',
            thumbnail: { src: '', alt: '', caption: '' },
            started_time: null,
          }),
          [field === 'description' ? 'abstract' : field]:
            field === 'started_time' && value
              ? Timestamp.fromDate(new Date(value))
              : value,
          thumbnail: {
            ...(mainData.project_overviews[projectKey]?.thumbnail || {
              src: '',
              alt: '',
              caption: '',
            }),
            title:
              field === 'title'
                ? value
                : mainData.project_overviews[projectKey]?.title || '',
          },
        },
      },
    });
  };

  const uploadProjectImage = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `projects/overview/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        const projectKey =
          Object.keys(mainData.project_overviews)[index] ||
          `Dự Án_0_${new Date().toISOString()}`;
        console.log(projectKey);

        await updateData({
          project_overviews: {
            ...mainData.project_overviews,
            [projectKey]: {
              ...(mainData.project_overviews[projectKey] || {
                title: '',
                abstract: '',
                thumbnail: { src: '', alt: '', caption: '' },
                started_time: null,
              }),
              thumbnail: {
                ...(mainData.project_overviews[projectKey]?.thumbnail || {
                  src: '',
                  alt: '',
                  caption: '',
                }),
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(
          `Error uploading project overview image ${index}:`,
          error
        );
      }
    } else {
      console.error(`Invalid file for project overview image ${index}:`, file);
    }
  };

  const updateDonateField = async (field, value) => {
    console.log('updateDonateField:', { field, value });
    await debouncedUpdateData({
      hero_sections: {
        ...mainData.hero_sections,
        donate: { ...mainData.hero_sections.donate, [field]: value },
      },
    });
  };

  const uploadDonateImage = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `hero/donate/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        const currentImages = Array.isArray(
          mainData.hero_sections.donate.images
        )
          ? [...mainData.hero_sections.donate.images]
          : ['', ''];

        currentImages[index] = downloadUrl;

        await updateData({
          hero_sections: {
            ...mainData.hero_sections,
            donate: { ...mainData.hero_sections.donate, images: currentImages },
          },
        });
      } catch (error) {
        console.error(`Error uploading donate image ${index}:`, error);
      }
    } else {
      console.error(`Invalid file for donate image ${index}:`, file);
    }
  };

  const updateEventsField = async (index, field, value) => {
    console.log('updateEventsField:', { index, field, value });
    const eventKeys = Object.keys(mainData.event_overviews);
    const eventKey =
      eventKeys[index] || `Sự Kiện_${index}_${new Date().toISOString()}`;
    await debouncedUpdateData({
      event_overviews: {
        ...mainData.event_overviews,
        [eventKey]: {
          ...(mainData.event_overviews[eventKey] || {
            title: '',
            abstract: '',
            thumbnail: { src: '', alt: '', caption: '' },
          }),
          [field === 'title' ? 'title' : 'abstract']: value,
          thumbnail: {
            ...(mainData.event_overviews[eventKey]?.thumbnail || {
              src: '',
              alt: '',
              caption: '',
            }),
            title:
              field === 'title'
                ? value
                : mainData.event_overviews[eventKey]?.title || '',
          },
        },
      },
    });
  };

  const uploadEventsImage = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `events/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        const eventKeys = Object.keys(mainData.event_overviews);
        const eventKey =
          eventKeys[index] || `Sự Kiện_${index}_${new Date().toISOString()}`;
        await updateData({
          event_overviews: {
            ...mainData.event_overviews,
            [eventKey]: {
              ...(mainData.event_overviews[eventKey] || {
                title: '',
                abstract: '',
                thumbnail: { src: '', alt: '', caption: '' },
              }),
              thumbnail: {
                ...(mainData.event_overviews[eventKey]?.thumbnail || {
                  src: '',
                  alt: '',
                  caption: '',
                }),
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading event image ${index}:`, error);
      }
    } else {
      console.error(`Invalid file for event image ${index}:`, file);
    }
  };

  const updateProjectData = async (id, field, value) => {
    console.log('updateProjectData:', { id, field, value });
    if (field === 'delete') {
      await updateData({
        project_overviews: {
          ...Object.keys(mainData.project_overviews)
            .filter((key) => key !== id)
            .reduce(
              (acc, key) => ({
                ...acc,
                [key]: mainData.project_overviews[key],
              }),
              {}
            ),
        },
      });
    } else {
      await debouncedUpdateData({
        project_overviews: {
          ...mainData.project_overviews,
          [id]: {
            ...(mainData.project_overviews[id] || {
              title: '',
              abstract: '',
              thumbnail: { src: '', alt: '', caption: '' },
              started_time: null,
            }),
            [field === 'title'
              ? 'title'
              : field === 'description'
              ? 'abstract'
              : field]:
              field === 'started_time' && value
                ? Timestamp.fromDate(new Date(value))
                : value,
            thumbnail: {
              ...(mainData.project_overviews[id]?.thumbnail || {
                src: '',
                alt: '',
                caption: '',
              }),
              title:
                field === 'title'
                  ? value
                  : mainData.project_overviews[id]?.title || '',
            },
          },
        },
      });
    }
  };

  const uploadProjectLayoutImage = async (id, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `projects/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateData({
          project_overviews: {
            ...mainData.project_overviews,
            [id]: {
              ...(mainData.project_overviews[id] || {
                title: '',
                abstract: '',
                thumbnail: { src: '', alt: '', caption: '' },
                started_time: null,
              }),
              thumbnail: {
                ...(mainData.project_overviews[id]?.thumbnail || {
                  src: '',
                  alt: '',
                  caption: '',
                }),
                src: downloadUrl,
              },
            },
          },
        });
      } catch (error) {
        console.error(`Error uploading project image ${id}:`, error);
      }
    } else {
      console.error(`Invalid file for project image ${id}:`, file);
    }
  };

  const createProject = async () => {
    const newId = `Dự Án_${
      Object.keys(mainData.project_overviews).length
    }_${new Date().toISOString()}`;
    await updateData({
      project_overviews: {
        ...mainData.project_overviews,
        [newId]: {
          title: '',
          abstract: '',
          thumbnail: { src: '', alt: '', caption: '' },
          started_time: null,
        },
      },
    });
  };

  const removeProject = async (id) => {
    await updateData({
      project_overviews: {
        ...Object.keys(mainData.project_overviews)
          .filter((key) => key !== id)
          .reduce(
            (acc, key) => ({ ...acc, [key]: mainData.project_overviews[key] }),
            {}
          ),
      },
    });
  };

  // Use first project for ProjectOverview with safe access
  const projectOverview =
    Object.keys(mainData.project_overviews).length > 0
      ? {
          heading: 'Tổng quan dự án',
          title:
            mainData.project_overviews[
              Object.keys(mainData.project_overviews)[0]
            ].title || '',
          description:
            mainData.project_overviews[
              Object.keys(mainData.project_overviews)[0]
            ].abstract || '',
          images: Object.keys(mainData.project_overviews).map(
            (key) => mainData.project_overviews[key].thumbnail?.src || ''
          ),
          started_time:
            mainData.project_overviews[
              Object.keys(mainData.project_overviews)[0]
            ].started_time instanceof Timestamp
              ? mainData.project_overviews[
                  Object.keys(mainData.project_overviews)[0]
                ].started_time
                  .toDate()
                  .toISOString()
                  .split('T')[0]
              : '',
        }
      : {
          heading: 'Tổng quan dự án',
          title: '',
          description: '',
          images: [],
          started_time: '',
        };

  // Use hero_sections.donate for DonateOverview
  const donateOverview = {
    heading: 'Hãy đồng hành cùng chúng mình',
    title1: mainData.hero_sections.donate.title1 || 'Đặt mua bánh chưng',
    title2: mainData.hero_sections.donate.title2 || 'Ủng hộ hiện kim',
    images: [...mainData.hero_sections.donate.images],
  };

  // Use event_overviews for EventsOverview
  const eventsOverview = {
    heading: 'Tổng kết các sự kiện đã qua',
    events: Object.entries(mainData.event_overviews).map(([key, event]) => ({
      title: event.title || '',
      imageUrl: event.thumbnail?.src || '',
    })),
  };

  // Limit refs to one for ProjectOverview and DonateOverview (single image each)
  const projectImageInputRefs = [useRef(null)];
  const donateImageInputRefs = [useRef(null)];
  const eventsImageInputRefs = Object.keys(mainData.event_overviews).map(() =>
    useRef(null)
  );

  return (
    <div style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        title={mainData.hero_sections.events.title || ''}
        description={mainData.hero_sections.events.description || ''}
        backgroundImage={mainData.hero_sections.events.image || ''}
        handleFieldChange={updateHeroField}
        handleImageUpload={uploadHeroImage}
      />

      <div className="projects">
        <ProjectOverview
          pageData={projectOverview}
          handleFieldChange={updateProjectField}
          handleImageUpload={uploadProjectImage}
          buttonColor={secondaryBackgroundColor}
        />

        <DonateOverview
          pageData={donateOverview}
          handleFieldChange={updateDonateField}
          handleImageUpload={uploadDonateImage}
          buttonColor={secondaryBackgroundColor}
        />

        <ProjectLayout
          projects={mainData.project_overviews}
          onChange={updateProjectData}
          onImageUpload={uploadProjectLayoutImage}
          addProject={createProject}
          deleteProject={removeProject}
          buttonColor={secondaryBackgroundColor}
        />

        <EventsOverview
          pageData={eventsOverview}
          handleFieldChange={updateEventsField}
          handleImageUpload={uploadEventsImage}
          imageInputRefs={eventsImageInputRefs}
          buttonColor={secondaryBackgroundColor}
        />
      </div>
    </div>
  );
}

export default Events;
