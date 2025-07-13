import React, { useContext } from "react";
import PropTypes from "prop-types";
import HeroSection from "./AboutPageSection/HeroSection.jsx";
import MissionSection from "./AboutPageSection/MissionSection.jsx";
import VisionSection from "./AboutPageSection/VisionSection.jsx";
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

  const updateMainData = async (updates) => {
    setMainData((prevMainData) => {
      const newMainData = { ...prevMainData, ...updates };
      try {
        const docRef = doc(db, "Main pages", "components");
        updateDoc(docRef, newMainData);
      } catch (error) {
        console.error("Error updating mainData:", error);
      }
      return newMainData;
    });
  };

  const handleFieldChange = async (field, value) => {
    if (!value.trim() && field !== "backgroundColor") return;
    updateMainData({
      hero_sections: {
        ...mainData.hero_sections,
        about: { ...mainData.hero_sections.about, [field]: value },
      },
    });
  };

  const handleImageUpload = async (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `about/hero_sections/about/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
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
    if (!value.trim()) return;
    updateMainData({
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
        updateMainData({
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
    if (!value.trim()) return;
    updateMainData({
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
        updateMainData({
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
    updateMainData({
      members: [...mainData.members, { name: "", role: "", image: "" }],
    });
  };

  const deleteMember = async (index) => {
    updateMainData({
      members: mainData.members.filter((_, i) => i !== index),
    });
  };

  const handleActivityChange = async (index, field, value) => {
    if (field === "delete") {
      deleteActivity(index);
    } else if (!value.trim() && field !== "started_time" && field !== "ended_time") {
      return;
    } else {
      updateMainData({
        activity_history: mainData.activity_history.map((activity, i) =>
          i === index
            ? {
                ...activity,
                [field]: field === "started_time" || field === "ended_time" ? new Date(value) : value,
              }
            : activity
        ),
      });
    }
  };

  const handleActivityImageUpload = async (index, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      try {
        const storageRef = ref(storage, `about/activity_history/${field}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        updateMainData({
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
    updateMainData({
      activity_history: [
        ...mainData.activity_history,
        {
          started_time: new Date(),
          ended_time: new Date(),
          text: "",
          image1: "",
          image2: "",
        },
      ],
    });
  };

  const deleteActivity = async (index) => {
    updateMainData({
      activity_history: mainData.activity_history.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden" style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        coverImage={mainData.hero_sections.about.image}
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
                startDate={activity.started_time?.toDate ? activity.started_time.toDate().toISOString().split("T")[0] : ""}
                endDate={activity.ended_time?.toDate ? activity.ended_time.toDate().toISOString().split("T")[0] : ""}
                imageUrl1={activity.image1}
                imageUrl2={activity.image2}
                description={activity.text}
                onChange={(field, value) => handleActivityChange(index, field, value)}
                onImageUpload={(field, file) => handleActivityImageUpload(index, field, file)}
                buttonColor={tertiaryBackgroundColor}
              />
              <button
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full cursor-pointer z-10"
                onClick={() => deleteActivity(index)}
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