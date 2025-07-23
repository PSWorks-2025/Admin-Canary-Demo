import React, { useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import { ColorContext } from "../../layout";
import { db, storage } from "../../service/firebaseConfig";
import useImagePreloader from "../../hooks/useImagePreloader";
import LoadingScreen from "../../components/screens/LoadingScreen";
import SaveFloatingButton from "../../globalComponent/SaveButton";
import SectionWrap from "../../components/SectionWrap";

function Aboutpage({mainData,setMainData}) {
  const { primaryBackgroundColor, secondaryBackgroundColor, tertiaryBackgroundColor } = useContext(ColorContext);
  const [localData, setLocalData] = useState({
    hero_sections: { about: { title: "", description: "", coverImage: "" } },
    statements: { mission: { title: "", description: "", imageUrl: "" }, vision: { title: "", description: "", imageUrl: "" } },
    members: [],
    activity_history: [],
  });
  const [pendingImages, setPendingImages] = useState([]); // Array of { field, key, file, blobUrl }
  const imagesToPreload = [
    localData.hero_sections?.about?.coverImage || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    localData.statements?.mission?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    localData.statements?.vision?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ...localData.members.map((member) => member.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png"),
    ...localData.activity_history.flatMap((activity) => [
      activity.image1 || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
      activity.image2 || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
    ]),
  ];
  const imagesLoaded = useImagePreloader(imagesToPreload);

  useEffect(() => {
    const fetchData = async () => {
      const data = mainData || {};
          setLocalData({
            hero_sections: {
              about: {
                title: data.hero_sections?.about?.title || "",
                description: data.hero_sections?.about?.description || "",
                coverImage: data.hero_sections?.about?.coverImage || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
              },
            },
            statements: {
              mission: {
                title: data.statements?.mission?.title || "",
                description: data.statements?.mission?.description || "",
                imageUrl: data.statements?.mission?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
              },
              vision: {
                title: data.statements?.vision?.title || "",
                description: data.statements?.vision?.description || "",
                imageUrl: data.statements?.vision?.imageUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
              },
            },
            members: (data.members || []).map((member) => ({
              name: member.name || "",
              role: member.role || "",
              image: member.image || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
            })),
            activity_history: (data.activity_history || []).map((activity) => ({
              started_time: activity.started_time || null,
              ended_time: activity.ended_time || null,
              text: activity.text || "",
              image1: activity.image1 || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
              image2: activity.image2 || "https://blog.photobucket.com/hubfs/upload_pics_online.png",
            })),
          });
        }
     
    fetchData();
  }, []);

  const updateHeroField = (field, value) => {
    setLocalData((prev) => ({
      ...prev,
      hero_sections: {
        ...prev.hero_sections,
        about: { ...prev.hero_sections.about, [field]: value },
      },
    }));
  };

  const updateHeroImage = (field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [...prev.filter((img) => img.field !== field || img.key !== "hero"), { field, key: "hero", file, blobUrl }]);
      setLocalData((prev) => ({
        ...prev,
        hero_sections: {
          ...prev.hero_sections,
          about: { ...prev.hero_sections.about, [field]: blobUrl },
        },
      }));
    }
  };

  const updateNestedField = (section, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      statements: {
        ...prev.statements,
        [section]: { ...prev.statements[section], [field]: value },
      },
    }));
  };

  const updateNestedImage = (section, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [...prev.filter((img) => img.key !== section), { field, key: section, file, blobUrl }]);
      setLocalData((prev) => ({
        ...prev,
        statements: {
          ...prev.statements,
          [section]: { ...prev.statements[section], [field]: blobUrl },
        },
      }));
    }
  };

  const updateMemberField = (index, field, value) => {
    setLocalData((prev) => ({
      ...prev,
      members: prev.members.map((member, i) => (i === index ? { ...member, [field]: value } : member)),
    }));
  };

  const updateMemberImage = (index, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [...prev.filter((img) => img.key !== `member_${index}`), { field: "image", key: `member_${index}`, file, blobUrl }]);
      setLocalData((prev) => ({
        ...prev,
        members: prev.members.map((member, i) => (i === index ? { ...member, image: blobUrl } : member)),
      }));
    }
  };

  const addMember = () => {
    setLocalData((prev) => ({
      ...prev,
      members: [...prev.members, { name: "", role: "", image: "https://blog.photobucket.com/hubfs/upload_pics_online.png" }],
    }));
  };

  const deleteMember = (index) => {
    setLocalData((prev) => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index),
    }));
    setPendingImages((prev) => prev.filter((img) => img.key !== `member_${index}`));
  };

  const updateActivityField = (index, field, value) => {
    const isValidDate = (dateStr) => !isNaN(new Date(dateStr).getTime());
    const dateValue = (field === "started_time" || field === "ended_time") && value && isValidDate(value) ? value : value;
    setLocalData((prev) => ({
      ...prev,
      activity_history: prev.activity_history.map((activity, i) =>
        i === index ? { ...activity, [field]: dateValue } : activity
      ),
    }));
  };

  const updateActivityImage = (index, field, file) => {
    if (file instanceof File || file instanceof Blob) {
      const blobUrl = URL.createObjectURL(file);
      setPendingImages((prev) => [...prev.filter((img) => img.key !== `activity_${index}_${field}`), { field, key: `activity_${index}_${field}`, file, blobUrl }]);
      setLocalData((prev) => ({
        ...prev,
        activity_history: prev.activity_history.map((activity, i) =>
          i === index ? { ...activity, [field]: blobUrl } : activity
        ),
      }));
    }
  };

  const addActivity = () => {
    setLocalData((prev) => ({
      ...prev,
      activity_history: [
        ...prev.activity_history,
        {
          started_time: null,
          ended_time: null,
          text: "",
          image1: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
          image2: "https://blog.photobucket.com/hubfs/upload_pics_online.png",
        },
      ],
    }));
  };

  const deleteActivity = (index) => {
    setLocalData((prev) => ({
      ...prev,
      activity_history: prev.activity_history.filter((_, i) => i !== index),
    }));
    setPendingImages((prev) => prev.filter((img) => !img.key.startsWith(`activity_${index}_`)));
  };

  const saveChanges = async () => {
    try {
      // Upload pending images to Firebase Storage
      const imageUpdates = {};
      for (const { field, key, file } of pendingImages) {
        const storagePath =
          key === "hero"
            ? `hero_sections/about/${file.name}`
            : key.startsWith("member_")
            ? `about/members/${file.name}`
            : key.startsWith("activity_")
            ? `about/activity_history/${field}/${file.name}`
            : `about/statements/${key}/${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);
        imageUpdates[`${key}.${field}`] = downloadUrl;
        URL.revokeObjectURL(file); // Clean up Blob URL
      }

      // Apply image updates to localData
      const updatedMainData = { ...localData };
      Object.entries(imageUpdates).forEach(([keyField, url]) => {
        const [key, field] = keyField.split(".");
        if (key === "hero") {
          updatedMainData.hero_sections.about[field] = url;
        } else if (key.startsWith("member_")) {
          const index = parseInt(key.replace("member_", ""), 10);
          updatedMainData.members[index][field] = url;
        } else if (key.startsWith("activity_")) {
          const [, index, imageField] = key.match(/activity_(\d+)_(image\d+)/);
          updatedMainData.activity_history[index][imageField] = url;
        } else {
          updatedMainData.statements[key][field] = url;
        }
      });

      // Convert date strings to Firestore Timestamps for activity_history
      updatedMainData.activity_history = updatedMainData.activity_history.map((activity) => ({
        ...activity,
        started_time: activity.started_time && !isNaN(new Date(activity.started_time).getTime()) ? Timestamp.fromDate(new Date(activity.started_time)) : null,
        ended_time: activity.ended_time && !isNaN(new Date(activity.ended_time).getTime()) ? Timestamp.fromDate(new Date(activity.ended_time)) : null,
      }));

      // Save to Firestore
      const docRef = doc(db, "Main pages", "components");
      await updateDoc(docRef, {
        hero_sections: updatedMainData.hero_sections,
        statements: updatedMainData.statements,
        members: updatedMainData.members,
        activity_history: updatedMainData.activity_history,
      });

      // Update state
      setLocalData(updatedMainData);
      setPendingImages([]); // Clear pending images
    } catch (error) {
      console.error("Error saving to Firestore:", error);
    }
  };

  if (!imagesLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden" style={{ backgroundColor: primaryBackgroundColor }}>
      <HeroSection
        coverImage={localData.hero_sections.about.coverImage}
        backgroundColor={primaryBackgroundColor}
        title={localData.hero_sections.about.title}
        description={localData.hero_sections.about.description}
        onFieldChange={updateHeroField}
        onImageUpload={updateHeroImage}
      />
      <SectionWrap className="w-full" borderColor={secondaryBackgroundColor}>
        <MissionSection
          mission={localData.statements.mission}
          onFieldChange={(field, value) => updateNestedField("mission", field, value)}
          onImageUpload={(field, file) => updateNestedImage("mission", field, file)}
        />
        <VisionSection
          vision={localData.statements.vision}
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
        <ScrollMemberList key={localData.members.length}>
          {localData.members.map((member, index) => (
            <div key={`member_${index}`} className="relative w-full max-w-[16rem] mx-auto">
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
          {localData.activity_history.map((activity, index) => (
            <div key={`activity_${index}`} className="relative w-full max-w-[20rem] mx-auto">
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
      <SaveFloatingButton visible={true} onSave={saveChanges} />
      <div className="mt-8 md:mt-20" />
    </div>
  );
}

export default Aboutpage;