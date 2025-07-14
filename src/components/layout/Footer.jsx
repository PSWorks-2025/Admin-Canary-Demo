import PropTypes from "prop-types";
import { useState } from "react";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function Footer({ tertiaryBackgroundColor, globalData, setGlobalData }) {
  console.log(globalData);
  
  const [footerData, setFooterData] = useState({
    groupName: globalData?.groupName || "CANARY",
    description:
      globalData?.description ||
      "Website CANARY - Nền tảng gây quỹ cộng đồng trực tuyến tiện lợi, tin cậy và minh bạch.",
    hotline: globalData?.hotline || "0333.456.789",
    email: globalData?.email || "kenlee@gmail.com",
    address:
      globalData?.address || "lô A2 Trần Đăng Ninh, P.Hòa Cường Bắc, Q.Hải Châu, Đà Nẵng",
    logoUrl: globalData?.logo_footer || "https://i.ibb.co/kVQhWyjz/logo.png",
    backgroundColor: "#1f2937",
    social_media: globalData?.social_media
      ? Object.entries(globalData.social_media).map(([name, url], index) => ({
          id: `link_${index}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          url,
        }))
      : [
          { id: "link_0", name: "Facebook", url: "https://www.facebook.com" },
          { id: "link_1", name: "YouTube", url: "https://www.youtube.com" },
          { id: "link_2", name: "TikTok", url: "https://www.tiktok.com" },
        ],
  });

  const handleFieldChange = (field, value) => {
    setFooterData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    setGlobalData((prevGlobalData) => ({
      ...prevGlobalData,
      [field]: value,
    }));
  };

  const handleLogoUpload = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        setFooterData((prevData) => ({
          ...prevData,
          logoUrl,
        }));
        setGlobalData((prevGlobalData) => ({
          ...prevGlobalData,
          logo_footer: logoUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = async (id, field, value) => {
    setFooterData((prevData) => ({
      ...prevData,
      social_media: prevData.social_media.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }));
    setGlobalData((prevGlobalData) => ({
      ...prevGlobalData,
      social_media: footerData.social_media.reduce((acc, link) => ({
        ...acc,
        [link.name.toLowerCase()]: link.url,
      }), {}),
    }));
  };

  const addSocialLink = () => {
    const newId = `link_${footerData.social_media.length}`;
    setFooterData((prevData) => ({
      ...prevData,
      social_media: [
        ...prevData.social_media,
        { id: newId, name: "", url: "" },
      ],
    }));
    setGlobalData((prevGlobalData) => ({
      ...prevGlobalData,
      social_media: [
        ...footerData.social_media,
        { id: newId, name: "", url: "" },
      ].reduce((acc, link) => ({
        ...acc,
        [link.name.toLowerCase()]: link.url,
      }), {}),
    }));
  };

  const deleteSocialLink = async (id) => {
    setFooterData((prevData) => ({
      ...prevData,
      social_media: prevData.social_media.filter((link) => link.id !== id),
    }));
    setGlobalData((prevGlobalData) => ({
      ...prevGlobalData,
      social_media: footerData.social_media
        .filter((link) => link.id !== id)
        .reduce((acc, link) => ({
          ...acc,
          [link.name.toLowerCase()]: link.url,
        }), {}),
    }));
  };
  

  return (
    <div
      className="w-full px-10 py-8 text-secondary-paragraph"
      style={{ backgroundColor: tertiaryBackgroundColor }}
    >
      <div className="w-full flex justify-center mb-4"></div>
      <div className="w-full flex">
        <div className="w-1/2 px-10">
          <div className="h-16 flex items-center relative">
            <div
              className="h-11 bg-primary rounded-full w-11 bg-cover bg-center"
              style={{ backgroundImage: `url("${footerData.logoUrl}")` }}
            ></div>
            <ImageInput
              handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
              section="logo"
              top="-top-0.5"
            />
            <TextInput
              className="ml-4 font-bold outline-none"
              value={footerData.groupName}
              onChange={(e) => handleFieldChange("groupName", e.target.value)}
              placeholder={"Nhập tên nhóm"}
            />
          </div>
          <TextInput
            type="textarea"
            className="w-full text-base text-secondary-paragraph outline-none bg-transparent resize-none"
            value={footerData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="3"
          />
          <TextInput
            className="w-full text-base text-secondary-paragraph outline-none bg-transparent"
            value={footerData.hotline}
            onChange={(e) => handleFieldChange("hotline", e.target.value)}
            placeholder="Nhập số hotline"
          />
          <TextInput
            className="w-full text-base text-secondary-paragraph outline-none bg-transparent"
            value={footerData.email}
            onChange={(e) => handleFieldChange("email", e.target.value)}
            placeholder="Nhập email"
          />
          <TextInput
            className="w-full text-base text-secondary-paragraph outline-none bg-transparent"
            value={footerData.address}
            onChange={(e) => handleFieldChange("address", e.target.value)}
            placeholder="Nhập địa chỉ"
          />
        </div>
        <div className="w-1/2 px-10 [&>a]:block [&>a]:hover:text-secondary-hover [&>a]:transition">
          <div className="h-16 flex items-center font-bold">Truyền thông</div>
          {footerData.social_media.map((link) => (
            <div key={link.id} className="flex gap-2 mb-2 items-center">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-paragraph hover:text-secondary-hover"
                aria-label={link.name}
              >
                <i className={`fab fa-${link.name.toLowerCase()}`} />
              </a>
              <TextInput
                className="text-base text-secondary-paragraph outline-none bg-transparent"
                value={link.name}
                onChange={(e) => handleSocialLinkChange(link.id, "name", e.target.value)}
                placeholder="Tên mạng xã hội"
              />
              <TextInput
                className="text-base text-secondary-paragraph outline-none bg-transparent"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(link.id, "url", e.target.value)}
                placeholder="Liên kết mạng xã hội"
              />
              <button
                onClick={() => deleteSocialLink(link.id)}
                className="p-1 bg-red-500 text-white rounded-full cursor-pointer"
              >
                <svg
                  className="w-4 h-4"
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
          <button
            onClick={addSocialLink}
            className="py-2 px-5 rounded-full cursor-pointer font-semibold bg-secondary-darken text-secondary-title mt-2"
          >
            Thêm liên kết
          </button>
        </div>
      </div>
    </div>
  );
}

Footer.propTypes = {
  tertiaryBackgroundColor: PropTypes.string,
  globalData: PropTypes.shape({
    groupName: PropTypes.string,
    description: PropTypes.string,
    hotline: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    logo: PropTypes.string,
    social_media: PropTypes.object,
  }),
  setGlobalData: PropTypes.func,
};

export default Footer;