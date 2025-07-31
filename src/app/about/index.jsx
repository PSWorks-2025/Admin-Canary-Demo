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
import StorySection from "../../components/HomePageSection/StorySection";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";

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
    storyOverviews,
    setStoryOverviews,
    storiesTitle,
    setStoriesTitle,
    projectOverviews,
    setProjectOverviews,
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

  const [hasChanges, setHasChanges] = useState(false);

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="w-full mx-auto overflow-x-hidden pt-20"
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
      <div className="w-full">
        <StorySection
          data={storyOverviews}
          setData={setStoryOverviews}
          title={storiesTitle}
          setTitle={setStoriesTitle}
          enqueueImageUpload={enqueueImageUpload}
          buttonColor={secondaryBackgroundColor}
        />
      </div>
      <SectionWrap borderColor={tertiaryBackgroundColor} className="w-full">
        <div className="w-full pt-8 font-bold text-xl md:text-2xl text-primary-title text-center">
          Đội ngũ thành viên
        </div>
        <div className="w-full flex justify-center my-4">
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
            className="py-2 px-4 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title text-sm md:text-base"
          >
            Thêm thành viên
          </button>
        </div>
        <ScrollMemberList>
          {members.map((member, index) => (
            <div
              key={`member_${index}`}
              className="relative w-full max-w-[12rem] md:max-w-[16rem] mx-auto"
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
        <div className="w-full pt-8 font-bold text-xl md:text-2xl text-primary-title text-center">
          Lịch sử hoạt động
        </div>
        <div className="w-full flex justify-center my-4">
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
            className="py-2 px-4 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title text-sm md:text-base"
          >
            Thêm hoạt động
          </button>
        </div>
        <ActivityHistoryList>
          {activityHistory.map((activity, index) => (
            <div
              key={`activity_${index}`}
              className="relative w-full max-w-[1152px] mx-auto"
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
      <ProjectLayout
        projects={projectOverviews}
        setProjectOverviews={setProjectOverviews}
        enqueueImageUpload={enqueueImageUpload}
        setHasChanges={setHasChanges}
        buttonColor={secondaryBackgroundColor}
      />
      <div className="mt-8 md:mt-16 pb-20" />
    </div>
  );
}

export default Aboutpage;