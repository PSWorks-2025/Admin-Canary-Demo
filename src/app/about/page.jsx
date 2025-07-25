import React, { useContext, useState, useEffect } from "react";
import { motion } from "framer-motion";
import HeroSection from "../../components/AboutPageSection/HeroSection";
import MissionSection from "../../components/AboutPageSection/MissionSection";
import VisionSection from "../../components/AboutPageSection/VisionSection";
import {
  ScrollMemberList,
  ScrollMemberListItem,
} from "../../components/Lists/ScrollMemberList";
import {
  ActivityHistoryList,
  ActivityHistoryListItem,
} from "../../components/Lists/ActivityHistoryList";
import { db } from "../../service/firebaseConfig";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import SectionWrap from "../../components/SectionWrap";
import GlobalContext from "../../GlobalContext";

function Aboutpage() {
  const {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
    heroSections,
    setHeroSections,
    statements,
    setStatements,
    members,
    setMembers,
    activityHistory,
    setActivityHistory,
    enqueueImageUpload,
  } = useContext(GlobalContext);

  const imagesToPreload = [
    heroSections?.about?.coverImage || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    statements?.mission?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    statements?.vision?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ...members.map((member) => member.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png"),
    ...activityHistory.flatMap((activity) => [
      activity.image1 || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
      activity.image2 || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ]),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  const updateHeroField = (field, value) => {
    setHeroSections((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value },
    }));
  };

  const updateHeroImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `hero_sections/about/${file.name}`;
      enqueueImageUpload(`main.hero_sections.about.${field}`, storagePath, file);
      setHeroSections((prev) => ({
        ...prev,
        about: { ...prev.about, [field]: blobUrl },
      }));
    }
  };

  const updateNestedField = (section, field, value) => {
    setStatements((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateNestedImage = (section, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `about/statements/${section}/${file.name}`;
      enqueueImageUpload(`main.statements.${section}.${field}`, storagePath, file);
      setStatements((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: blobUrl },
      }));
    }
  };

  const updateMemberField = (index, field, value) => {
    setMembers((prev) =>
      prev.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      )
    );
  };

  const updateMemberImage = (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `about/members/${file.name}`;
      enqueueImageUpload(`main.members.${index}.image`, storagePath, file);
      setMembers((prev) =>
        prev.map((member, i) =>
          i === index ? { ...member, image: blobUrl } : member
        )
      );
    }
  };

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      {
        name: "",
        role: "",
        image: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
      },
    ]);
  };

  const deleteMember = (index) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const updateActivityField = (index, field, value) => {
    const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
    const dateValue =
      (field === "started_time" || field === "ended_time") && value && isValidDate(value)
        ? value
        : value;
    setActivityHistory((prev) =>
      prev.map((activity, i) =>
        i === index ? { ...activity, [field]: dateValue } : activity
      )
    );
  };

  const updateActivityImage = (index, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      const storagePath = `about/activity_history/${field}/${file.name}`;
      enqueueImageUpload(`main.activity_history.${index}.${field}`, storagePath, file);
      setActivityHistory((prev) =>
        prev.map((activity, i) =>
          i === index ? { ...activity, [field]: blobUrl } : activity
        )
      );
    }
  };

  const addActivity = () => {
    setActivityHistory((prev) => [
      ...prev,
      {
        started_time: null,
        ended_time: null,
        text: "",
        image1: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
        image2: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
      },
    ]);
  };

  const deleteActivity = (index) => {
    setActivityHistory((prev) => prev.filter((_, i) => i !== index));
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="w-full max-w-[100vw] overflow-x-hidden"
      style={{ backgroundColor: primaryBackgroundColor }}
    >
      <HeroSection
        coverImage={heroSections?.about?.coverImage}
        backgroundColor={primaryBackgroundColor}
        title={heroSections?.about?.title}
        description={heroSections?.about?.description}
        onFieldChange={updateHeroField}
        onImageUpload={updateHeroImage}
      />
      <SectionWrap className="w-full" borderColor={secondaryBackgroundColor}>
        <MissionSection
          mission={statements?.mission}
          onFieldChange={(field, value) => updateNestedField("mission", field, value)}
          onImageUpload={(field, file) => updateNestedImage("mission", field, file)}
        />
        <VisionSection
          vision={statements?.vision}
          onFieldChange={(field, value) => updateNestedField("vision", field, value)}
          onImageUpload={(field, file) => updateNestedImage("vision", field, file)}
        />
      </SectionWrap>
      <SectionWrap borderColor={tertiaryBackgroundColor} className="w-full">
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
        <ScrollMemberList key={members.length}>
          {members.map((member, index) => (
            <div
              key={`member_${index}`}
              className="relative w-full max-w-[16rem] mx-auto"
            >
              <ScrollMemberListItem
                index={index}
                imageUrl={member.image}
                name={member.name}
                role={member.role}
                onChange={(field, value) => updateMemberField(index, field, value)}
                onImageUpload={(file) => updateMemberImage(index, file)}
                onDelete={() => deleteMember(index)}
              />
            </div>
          ))}
        </ScrollMemberList>
      </SectionWrap>
      <SectionWrap borderColor={tertiaryBackgroundColor}>
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
          {activityHistory.map((activity, index) => (
            <div
              key={`activity_${index}`}
              className="relative w-full max-w-[20rem] mx-auto"
            >
              <ActivityHistoryListItem
                index={index}
                startDate={activity.started_time || ""}
                endDate={activity.ended_time || ""}
                imageUrl1={activity.image1}
                imageUrl2={activity.image2}
                description={activity.text}
                onChange={(field, value) => updateActivityField(index, field, value)}
                onImageUpload={(field, file) => updateActivityImage(index, field, file)}
                onDelete={() => deleteActivity(index)}
                buttonColor={tertiaryBackgroundColor}
              />
            </div>
          ))}
        </ActivityHistoryList>
      </SectionWrap>
      <div className="mt-8 md:mt-20" />
    </div>
  );
}

export default Aboutpage;