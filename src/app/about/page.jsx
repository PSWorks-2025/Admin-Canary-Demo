import { useState, useRef } from "react";
import cover from "/images/cover_2.jpg";
import {
  ScrollStoryList,
  ScrollStoryListItem,
} from "../../components/Lists/ScrollStoryList.jsx";
import {
  ScrollMemberList,
  ScrollMemberListItem,
} from "../../components/Lists/ScrollMemberList.jsx";
import {
  ActivityHistoryList,
  ActivityHistoryListItem,
} from "../../components/Lists/ActivityHistoryList.jsx";
import ProjectLayout from "../../components/ProjectLayout/ProjectLayout";
import canary1 from "/images/canary1.jpg";
import canary2 from "/images/canary2.jpg";
import canary3 from "/images/canary3.jpg";
import canary4 from "/images/canary4.jpg";
import canary5 from "/images/canary5.jpg";
import canary6 from "/images/canary6.jpg";
import canary7 from "/images/canary7.jpg";
import canary8 from "/images/canary8.jpg";
import canary9 from "/images/canary9.jpg";
import canary10 from "/images/canary10.jpg";

function Aboutpage() {
  const [pageData, setPageData] = useState({
    coverImage: cover,
    backgroundColor: "#ffffff",
    title: "Tên nội dung",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus, sed nihil voluptates et minus nulla doloremque architecto qui hic expedita nesciunt quis incidunt deleniti animi, possimus provident alias voluptatum nemo.",
    mission: {
      title: "Sứ mệnh",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam quod reprehenderit voluptatum veniam, dolore amet, voluptatibus eius, error temporibus quo accusamus expedita explicabo dolorum voluptates provident asperiores quas quae voluptatem.",
      imageUrl: canary10,
    },
    vision: {
      title: "Tầm nhìn",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam quod reprehenderit voluptatum veniam, dolore amet, voluptatibus eius, error temporibus quo accusamus expedita explicabo dolorum voluptates provident asperiores quas quae voluptatem.",
      imageUrl: canary9,
    },
    stories: {
      story_0: {
        title: "Tên câu chuyện",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
        href: "#",
        imageUrl: cover,
      },
      story_1: {
        title: "Tên câu chuyện",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
        href: "#",
        imageUrl: canary7,
      },
      story_2: {
        title: "Tên câu chuyện",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
        href: "#",
        imageUrl: canary8,
      },
      story_3: {
        title: "Tên câu chuyện",
        description:
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas possimus quis nihil unde eum. Magnam harum eligendi itaque veniam.",
        href: "#",
        imageUrl: canary9,
      },
    },
    members: {
      member_0: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
      member_1: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
      member_2: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
      member_3: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
      member_4: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
      member_5: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
      member_6: {
        name: "Tên",
        role: "Chức vụ",
        imageUrl: cover,
      },
    },
    activityHistory: {
      activity_0: {
        startDate: "6/2017",
        endDate: "8/2018",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, saepe eveniet atque veniam quas voluptates aliquam iure, accusamus aliquid autem, commodi soluta vitae cumque exercitationem voluptatum. Adipisci necessitatibus accusantium eum.",
        imageUrl1: canary1,
        imageUrl2: canary2,
      },
      activity_1: {
        startDate: "6/2017",
        endDate: "8/2018",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, saepe eveniet atque veniam quas voluptates aliquam iure, accusamus aliquid autem, commodi soluta vitae cumque exercitationem voluptatum. Adipisci necessitatibus accusantium eum.",
        imageUrl1: canary3,
        imageUrl2: canary4,
      },
      activity_2: {
        startDate: "6/2017",
        endDate: "8/2018",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, saepe eveniet atque veniam quas voluptates aliquam iure, accusamus aliquid autem, commodi soluta vitae cumque exercitationem voluptatum. Adipisci necessitatibus accusantium eum.",
        imageUrl1: canary5,
        imageUrl2: canary6,
      },
    },
    projects: {
      project_0: {
        title: "Tên dự án 1",
        imageUrl: canary1,
      },
      project_1: {
        title: "Tên dự án 2",
        imageUrl: canary2,
      },
      project_2: {
        title: "Tên dự án 3",
        imageUrl: canary3,
      },
      project_3: {
        title: "Tên dự án 4",
        imageUrl: canary4,
      },
    },
  });

  const coverInputRef = useRef(null);
  const missionImageRef = useRef(null);
  const visionImageRef = useRef(null);

  // Existing functions (unchanged)
  const handleFieldChange = (field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNestedFieldChange = (section, field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          [field]: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNestedImageUpload = (section, field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          [section]: {
            ...prevData[section],
            [field]: e.target.result,
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStoryChange = (id, field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      stories: {
        ...prevData.stories,
        [id]: {
          ...prevData.stories[id],
          [field]: value,
        },
      },
    }));
  };

  const handleStoryImageUpload = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          stories: {
            ...prevData.stories,
            [id]: {
              ...prevData.stories[id],
              imageUrl: e.target.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addStory = () => {
    const newId = `story_${Object.keys(pageData.stories).length}`;
    setPageData((prevData) => ({
      ...prevData,
      stories: {
        ...prevData.stories,
        [newId]: {
          title: "",
          description: "",
          href: "#",
          imageUrl: "",
        },
      },
    }));
  };

  const deleteStory = (id) => {
    setPageData((prevData) => {
      const { [id]: _, ...rest } = prevData.stories;
      return { ...prevData, stories: rest };
    });
  };

  const handleMemberChange = (id, field, value) => {
    setPageData((prevData) => ({
      ...prevData,
      members: {
        ...prevData.members,
        [id]: {
          ...prevData.members[id],
          [field]: value,
        },
      },
    }));
  };

  const handleMemberImageUpload = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          members: {
            ...prevData.members,
            [id]: {
              ...prevData.members[id],
              imageUrl: e.target.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addMember = () => {
    const newId = `member_${Object.keys(pageData.members).length}`;
    setPageData((prevData) => ({
      ...prevData,
      members: {
        ...prevData.members,
        [newId]: {
          name: "",
          role: "",
          imageUrl: "",
        },
      },
    }));
  };

  const deleteMember = (id) => {
    setPageData((prevData) => {
      const { [id]: _, ...rest } = prevData.members;
      return { ...prevData, members: rest };
    });
  };

  const handleActivityChange = (id, field, value) => {
    if (field === "delete") {
      deleteActivity(id);
    } else {
      setPageData((prevData) => ({
        ...prevData,
        activityHistory: {
          ...prevData.activityHistory,
          [id]: {
            ...prevData.activityHistory[id],
            [field]: value,
          },
        },
      }));
    }
  };

  const handleActivityImageUpload = (id, field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          activityHistory: {
            ...prevData.activityHistory,
            [id]: {
              ...prevData.activityHistory[id],
              [field]: e.target.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addActivity = () => {
    const newId = `activity_${Object.keys(pageData.activityHistory).length}`;
    setPageData((prevData) => ({
      ...prevData,
      activityHistory: {
        ...prevData.activityHistory,
        [newId]: {
          startDate: "",
          endDate: "",
          description: "",
          imageUrl1: "",
          imageUrl2: "",
        },
      },
    }));
  };

  const deleteActivity = (id) => {
    setPageData((prevData) => {
      const { [id]: _, ...rest } = prevData.activityHistory;
      return { ...prevData, activityHistory: rest };
    });
  };

  // New functions for projects
  const handleProjectChange = (id, field, value) => {
    if (field === "delete") {
      deleteProject(id);
    } else {
      setPageData((prevData) => ({
        ...prevData,
        projects: {
          ...prevData.projects,
          [id]: {
            ...prevData.projects[id],
            [field]: value,
          },
        },
      }));
    }
  };

  const handleProjectImageUpload = (id, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPageData((prevData) => ({
          ...prevData,
          projects: {
            ...prevData.projects,
            [id]: {
              ...prevData.projects[id],
              imageUrl: e.target.result,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addProject = () => {
    const newId = `project_${Object.keys(pageData.projects).length}`;
    setPageData((prevData) => ({
      ...prevData,
      projects: {
        ...prevData.projects,
        [newId]: {
          title: "",
          imageUrl: "",
        },
      },
    }));
  };

  const deleteProject = (id) => {
    setPageData((prevData) => {
      const { [id]: _, ...rest } = prevData.projects;
      return { ...prevData, projects: rest };
    });
  };

  return (
    <div className="w-full" style={{ backgroundColor: pageData.backgroundColor }}>
      <div className="relative">
        <div
          className="w-full bg-cover bg-bottom flex justify-center items-end bg-blend-multiply"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)), url("${pageData.coverImage}")`,
            height: "calc(100vh - 5rem)",
          }}
        >
          <button
            className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
            onClick={() => coverInputRef.current.click()}
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
              />
            </svg>
          </button>
          <input
            type="file"
            ref={coverInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload("coverImage", e.target.files[0])}
          />
          <input
            type="color"
            className="absolute top-2 right-2 w-8 h-8 rounded-full cursor-pointer z-10"
            value={pageData.backgroundColor}
            onChange={(e) => handleFieldChange("backgroundColor", e.target.value)}
          />
          <div className="w-280">
            <input
              className="w-full text-[2.5rem] font-semibold text-secondary-title outline-none bg-transparent"
              value={pageData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              placeholder="Nhập tiêu đề"
            />
            <textarea
              className="w-full text-secondary-title mb-6 outline-none bg-transparent resize-none"
              value={pageData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="Nhập mô tả"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="w-full pt-20 flex">
        <div className="w-1/2 px-4 relative">
          <div
            className="w-162 h-102 -mr-26 bg-cover bg-center float-right rounded-lg"
            style={{ backgroundImage: `url("${pageData.mission.imageUrl}")` }}
          ></div>
          <button
            className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
            onClick={() => missionImageRef.current.click()}
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
              />
            </svg>
          </button>
          <input
            type="file"
            ref={missionImageRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleNestedImageUpload("mission", "imageUrl", e.target.files[0])}
          />
        </div>
        <div className="w-1/2 px-4 flex items-center">
          <div className="w-136 h-62 rounded-lg bg-tag-2 text-primary-title shadow-[1.5rem_-1.5rem_#E6EBFB] z-20">
            <input
              className="w-full font-bold text-[2.5rem] pt-12 text-center outline-none bg-transparent"
              value={pageData.mission.title}
              onChange={(e) => handleNestedFieldChange("mission", "title", e.target.value)}
              placeholder="Nhập tiêu đề sứ mệnh"
            />
            <textarea
              className="w-full px-8 text-base/5 font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
              value={pageData.mission.description}
              onChange={(e) => handleNestedFieldChange("mission", "description", e.target.value)}
              placeholder="Nhập mô tả sứ mệnh"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="w-full pt-20 flex flex-row-reverse">
        <div className="w-1/2 px-4 relative">
          <div
            className="w-162 h-102 -ml-26 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url("${pageData.vision.imageUrl}")` }}
          ></div>
          <button
            className="absolute top-2 left-2 p-2 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
            onClick={() => visionImageRef.current.click()}
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
              />
            </svg>
          </button>
          <input
            type="file"
            ref={visionImageRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleNestedImageUpload("vision", "imageUrl", e.target.files[0])}
          />
        </div>
        <div className="w-1/2 px-4 flex items-center justify-end">
          <div className="w-136 h-62 rounded-lg bg-tag-2 text-primary-title shadow-[-1.5rem_-1.5rem_#E6EBFB] z-0">
            <input
              className="w-full font-bold text-[2.5rem] pt-12 text-center outline-none bg-transparent"
              value={pageData.vision.title}
              onChange={(e) => handleNestedFieldChange("vision", "title", e.target.value)}
              placeholder="Nhập tiêu đề tầm nhìn"
            />
            <textarea
              className="w-full px-8 text-base/5 font-medium py-2 text-primary-paragraph text-center outline-none bg-transparent resize-none"
              value={pageData.vision.description}
              onChange={(e) => handleNestedFieldChange("vision", "description", e.target.value)}
              placeholder="Nhập mô tả tầm nhìn"
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>
      <div>
        <div className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center">
          Các câu chuyện ý nghĩa
        </div>
        <div className="w-full flex justify-center mb-8">
          <button
            onClick={addStory}
            className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
          >
            Thêm câu chuyện
          </button>
        </div>
        <ScrollStoryList>
          {Object.entries(pageData.stories)
            .map(([key, story]) => [key.slice(6), story])
            .sort((a, b) => a[0] - b[0])
            .map(([key, story]) => (
              <div key={`story_${key}`} className="relative">
                <ScrollStoryListItem
                  id={`story_${key}`}
                  imageUrl={story.imageUrl}
                  title={story.title}
                  description={story.description}
                  href={story.href}
                  onChange={handleStoryChange}
                  onImageUpload={handleStoryImageUpload}
                />
              
              </div>
            ))}
        </ScrollStoryList>
      </div>
      <div>
        <div className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center">
          Đội ngũ thành viên
        </div>
        <div className="w-full flex justify-center mb-8">
          <button
            onClick={addMember}
            className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
          >
            Thêm thành viên
          </button>
        </div>
        <ScrollMemberList>
          {Object.entries(pageData.members)
            .map(([key, member]) => [key.slice(6), member])
            .sort((a, b) => a[0] - b[0])
            .map(([key, member]) => (
              <div key={`member_${key}`} className="relative">
                <ScrollMemberListItem
                  id={`member_${key}`}
                  imageUrl={member.imageUrl}
                  name={member.name}
                  role={member.role}
                  onChange={handleMemberChange}
                  onImageUpload={handleMemberImageUpload}
                />
               
              </div>
            ))}
        </ScrollMemberList>
      </div>
      <div>
        <div className="w-full pt-20 font-bold text-[2.5rem] text-primary-title text-center">
          Lịch sử hoạt động
        </div>
        <div className="w-full flex justify-center mb-8">
          <button
            onClick={addActivity}
            className="py-2 px-6 rounded-full cursor-pointer font-semibold bg-secondary text-secondary-title"
          >
            Thêm hoạt động
          </button>
        </div>
        <ActivityHistoryList>
          {Object.entries(pageData.activityHistory)
            .map(([key, activity]) => [key.slice(9), activity])
            .sort((a, b) => a[0] - b[0])
            .map(([key, activity]) => (
              <div key={`activity_${key}`} className="relative">
                <ActivityHistoryListItem
                  id={`activity_${key}`}
                  startDate={activity.startDate}
                  endDate={activity.endDate}
                  imageUrl1={activity.imageUrl1}
                  imageUrl2={activity.imageUrl2}
                  description={activity.description}
                  onChange={handleActivityChange}
                  onImageUpload={handleActivityImageUpload}
                />
                
              </div>
            ))}
        </ActivityHistoryList>
      </div>
      <div className="mt-20"></div>
      <ProjectLayout
        projects={pageData.projects}
        onChange={handleProjectChange}
        onImageUpload={handleProjectImageUpload}
        addProject={addProject}
        deleteProject={deleteProject}
      />
    </div>
  );
}

export default Aboutpage;