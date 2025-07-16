import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Timestamp } from "firebase/firestore";
import HeroSection from "../../components/AboutPageSection/HeroSection";
import MissionSection from "../../components/AboutPageSection/MissionSection";
import VisionSection from "../../components/AboutPageSection/VisionSection/index.jsx";
import {
  ScrollMemberList,
  ScrollMemberListItem,
} from "../../components/Lists/ScrollMemberList.jsx";
import {
  ActivityHistoryList,
  ActivityHistoryListItem,
} from "../../components/Lists/ActivityHistoryList.jsx";
import { ColorContext } from "../../layout";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../service/firebaseConfig.jsx";

function Aboutpage() {
  const { primaryBackgroundColor, secondaryBackgroundColor, tertiaryBackgroundColor, mainData, setMainData } = useContext(ColorContext);

  // Normalize activity_history to ensure Timestamps
  useEffect(() => {
    if (mainData.activity_history.some(activity => 
      (activity.started_time && !(activity.started_time instanceof Timestamp)) ||
      (activity.ended_time && !(activity.ended_time instanceof Timestamp))
    )) {
      const normalizedHistory = mainData.activity_history.map(activity => ({
        ...activity,
        started_time: activity.started_time instanceof Date 
          ? Timestamp.fromDate(activity.started_time) 
          : activity.started_time || null,
        ended_time: activity.ended_time instanceof Date 
          ? Timestamp.fromDate(activity.ended_time) 
          : activity.ended_time || null,
      }));
      updateMainData({ activity_history: normalizedHistory });
    }
    console.log("mainData.activity_history:", mainData.activity_history);
  }, [mainData.activity_history]);

  // Deep merge utility to ensure nested updates
  const deepMerge = (target, source) => {
    const output = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) && !(source[key] instanceof Timestamp) && !(source[key] instanceof Date)) {
        output[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  };

  const updateMainData = async (updates) => {
    try {
      // Optimistic update: update local state first
      setMainData((prev) => {
        const newMainData = deepMerge(prev, updates);
        console.log("setMainData called with:", newMainData);
        return newMainData;
      });
      // Update Firestore
      const docRef = doc(db, "Main pages", "components");
      const mergedData = deepMerge(mainData, updates);
      await updateDoc(docRef, mergedData);
      console.log("Firestore updated successfully:", mergedData);
    } catch (error) {
      console.error("Error updating mainData:", error);
      // Revert state on error
      setMainData(mainData);
    }
  };

  const handleFieldChange = async (field, value) => {
    console.log("handleFieldChange:", { field, value });
    await updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        about: { ...mainData.hero_sections.about, [field]: value },
      },
    });
  };

  const handleImageUpload = async (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `/hero_sections/about/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateMainData({
          hero_sections: {
            ...mainData.hero_sections,
            about: { ...mainData.hero_sections.about, [field]: downloadUrl },
          },
        });
      } catch (error) {
        console.error(`Error uploading image for field ${field}:`, error);
      }
    } else {
      console.error(`Invalid file for field ${field}:`, file);
    }
  };

  const handleNestedFieldChange = async (section, field, value) => {
    console.log("handleNestedFieldChange:", { section, field, value });
    await updateMainData({
      statements: {
        ...mainData.statements,
        [section]: { ...mainData.statements[section], [field]: value },
      },
    });
  };

  const handleNestedImageUpload = async (section, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `about/statements/${section}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateMainData({
          statements: {
            ...mainData.statements,
            [section]: { ...mainData.statements[section], [field]: downloadUrl },
          },
        });
      } catch (error) {
        console.error(`Error uploading image for ${section} ${field}:`, error);
      }
    } else {
      console.error(`Invalid file for ${section} ${field}:`, file);
    }
  };

  const handleMemberChange = async (index, field, value) => {
    console.log("handleMemberChange:", { index, field, value });
    await updateMainData({
      members: mainData.members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    });
  };

  const handleMemberImageUpload = async (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `about/members/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateMainData({
          members: mainData.members.map((member, i) =>
            i === index ? { ...member, image: downloadUrl } : member
          ),
        });
      } catch (error) {
        console.error(`Error uploading image for member ${index}:`, error);
      }
    } else {
      console.error(`Invalid file for member ${index}:`, file);
    }
  };

  const addMember = async () => {
    await updateMainData({
      members: [...mainData.members, { name: "", role: "", image: "" }],
    });
  };

  const deleteMember = async (index) => {
    await updateMainData({
      members: mainData.members.filter((_, i) => i !== index),
    });
  };

  const handleActivityChange = async (index, field, value) => {
    console.log("handleActivityChange:", { index, field, value });
    if (field === "delete") {
      await deleteActivity(index);
    } else {
      const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
      const dateValue =
        (field === "started_time" || field === "ended_time") && value
          ? isValidDate(value)
            ? Timestamp.fromDate(new Date(value))
            : null
          : value;
      await updateMainData({
        activity_history: mainData.activity_history.map((activity, i) =>
          i === index
            ? { ...activity, [field]: dateValue }
            : activity
        ),
      });
      if ((field === "started_time" || field === "ended_time") && value && !isValidDate(value)) {
        console.warn(`Invalid date format for ${field}: ${value}`);
      }
    }
  };

  const handleActivityImageUpload = async (index, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `about/activity_history/${field}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        await updateMainData({
          activity_history: mainData.activity_history.map((activity, i) =>
            i === index ? { ...activity, [field]: downloadUrl } : activity
          ),
        });
      } catch (error) {
        console.error(`Error uploading image for activity ${index}, field ${field}:`, error);
      }
    } else {
      console.error(`Invalid file for activity ${index}, field ${field}:`, file);
    }
  };

  const addActivity = async () => {
    await updateMainData({
      activity_history: [
        ...mainData.activity_history,
        {
          started_time: null,
          ended_time: null,
          text: "",
          image1: "",
          image2: "",
        },
      ],
    });
  };

  const deleteActivity = async (index) => {
    await updateMainData({
      activity_history: mainData.activity_history.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden" style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        coverImage={mainData.hero_sections.about.coverImage}
        backgroundColor={primaryBackgroundColor}
        title={mainData.hero_sections.about.title}
        description={mainData.hero_sections.about.description}
        subtitle={mainData.hero_sections.about.subtitle}
        handleFieldChange={handleFieldChange}
        handleImageUpload={handleImageUpload}
      />
      <div className="border-b-3 border-black mx-4" />
      <MissionSection
        mission={mainData.statements.mission}
        handleNestedFieldChange={handleNestedFieldChange}
        handleNestedImageUpload={handleNestedImageUpload}
      />
      <VisionSection
        vision={mainData.statements.vision}
        handleNestedFieldChange={handleNestedFieldChange}
        handleNestedImageUpload={handleNestedImageUpload}
      />
      <div className="border-b-3 border-black mx-4" />
      <div>
        <div className="w-full pt-8 md:pt-20 font-bold text-2xl md:text-[2.5rem] text-primary-title text-center">
          Đội ngũ thành viên
        </div>
        <div className="w-full flex justify-center my-4 md:mb-8">
          <button
            onClick={addMember}
            className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
          >
            Thêm thành viên
          </button>
        </div>
        <ScrollMemberList key={mainData.members.length}>
          {mainData.members.map((member, index) => (
            <div key={`member_${index}`} className="relative w-full max-w-[16rem] mx-auto">
              <ScrollMemberListItem
                id={`member_${index}`}
                imageUrl={member.image}
                name={member.name}
                role={member.role}
                onChange={(field, value) => handleMemberChange(index, field, value)}
                onImageUpload={(file) => handleMemberImageUpload(index, file)}
                onDelete={() => deleteMember(index)}
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => deleteMember(index)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </ScrollMemberList>
      </div>
      <div className="border-b-3 border-black mx-4" />
      <div>
        <div className="w-full pt-8 md:pt-20 font-bold text-2xl md:text-[2.5rem] text-primary-title text-center">
          Lịch sử hoạt động
        </div>
        <div className="w-full flex justify-center my-4 md:mb-8">
          <button
            onClick={addActivity}
            className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
          >
            Thêm hoạt động
          </button>
        </div>
        <ActivityHistoryList>
          {mainData.activity_history.map((activity, index) => (
            <div key={`activity_${index}`} className="relative w-full max-w-[20rem] mx-auto">
              <ActivityHistoryListItem
                index={index}
                startDate={
                  activity.started_time && activity.started_time.toDate && !isNaN(activity.started_time.toDate().getTime())
                    ? activity.started_time.toDate().toISOString().split("T")[0]
                    : ""
                }
                endDate={
                  activity.ended_time && activity.ended_time.toDate && !isNaN(activity.ended_time.toDate().getTime())
                    ? activity.ended_time.toDate().toISOString().split("T")[0]
                    : ""
                }
                imageUrl1={activity.image1}
                imageUrl2={activity.image2}
                description={activity.text}
                onChange={(field, value) => handleActivityChange(index, field, value)}
                onImageUpload={(field, file) => handleActivityImageUpload(index, field, file)}
                buttonColor={tertiaryBackgroundColor}
              />
            </div>
          ))}
        </ActivityHistoryList>
      </div>
      <div className="mt-8 md:mt-20" />
    </div>
  );
}

Aboutpage.propTypes = {
  // No props needed since mainData is from ColorContext
};

export default Aboutpage;