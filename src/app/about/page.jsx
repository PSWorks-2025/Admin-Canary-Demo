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
    handleGlobalSave,
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

  // Xem thay đổi mà lỗi thì anh sửa
  const [hasChanges, setHasChanges] = useState(false);


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
        setHeroSections={setHeroSections}
        enqueueImageUpload={enqueueImageUpload}
        setHasChanges={setHasChanges}
      />
      <SectionWrap className="w-full" borderColor={secondaryBackgroundColor}>
        <MissionSection
          mission={statements?.mission || { title: "", description: "", imageUrl: "" }}
          setStatements={setStatements}
          enqueueImageUpload={enqueueImageUpload}
          setHasChanges={setHasChanges}
        />
        <VisionSection
          vision={statements?.vision || { title: "", description: "", imageUrl: "" }}
          setStatements={setStatements}
          enqueueImageUpload={enqueueImageUpload}
          setHasChanges={setHasChanges}
        />
      </SectionWrap>
      <SectionWrap borderColor={tertiaryBackgroundColor} className="w-full">
        <div className="w-full pt-8 md:pt-20 font-bold text-2xl md:text-[2.5rem] text-primary-title text-center">
          Đội ngũ thành viên
        </div>
        <div className="w-full flex justify-center my-4 md:mb-8">
          <button
            onClick={() => {
              setMembers((prev) => [
                ...prev,
                {
                  name: "",
                  role: "",
                  image: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
                },
              ]);
              setHasChanges(true);
            }}
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
                setMembers={setMembers}
                enqueueImageUpload={enqueueImageUpload}
                setHasChanges={setHasChanges}
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
            onClick={() => {
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
              setHasChanges(true);
            }}
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
                setActivityHistory={setActivityHistory}
                enqueueImageUpload={enqueueImageUpload}
                setHasChanges={setHasChanges}
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