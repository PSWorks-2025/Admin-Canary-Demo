import { useState, useRef } from "react";
import logo from "/images/logo.png";
import { ImageInput } from "../Inputs/ImageInput";
import { TextInput } from "../Inputs/TextInput";

function Footer({ tertiaryBackgroundColor }) {
  const [footerData, setFooterData] = useState({
    groupName: "CANARY",
    description:
      "Website CANARY - Nền tảng gây quỹ cộng đồng trực tuyến tiện lợi, tin cậy và minh bạch.",
    hotline: "0333.456.789",
    email: "kenlee@gmail.com",
    address:
      "lô A2 Trần Đăng Ninh, P.Hòa Cường Bắc, Q.Hải Châu, Đà Nẵng",
    logoUrl: logo,
    backgroundColor: "#1f2937", // Default background color (secondary)
    socialLinks: [
      { id: "link_0", name: "Facebook", url: "https://www.facebook.com" },
      { id: "link_1", name: "Youtube", url: "https://www.youtube.com" },
      { id: "link_2", name: "Tiktok", url: "https://www.tiktok.com" },
    ],
  });

  const fileInputRef = useRef(null);

  const handleFieldChange = (field, value) => {
    setFooterData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleLogoUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFooterData((prevData) => ({
          ...prevData,
          logoUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (id, field, value) => {
    setFooterData((prevData) => ({
      ...prevData,
      socialLinks: prevData.socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }));
  };

  const addSocialLink = () => {
    const newId = `link_${footerData.socialLinks.length}`;
    setFooterData((prevData) => ({
      ...prevData,
      socialLinks: [
        ...prevData.socialLinks,
        { id: newId, name: "", url: "" },
      ],
    }));
  };

  const deleteSocialLink = (id) => {
    setFooterData((prevData) => ({
      ...prevData,
      socialLinks: prevData.socialLinks.filter((link) => link.id !== id),
    }));
  };

  return (
    <div
      className="w-full px-30 py-8 text-secondary-paragraph"
      style={{ backgroundColor: tertiaryBackgroundColor }}
    >
      <div className="w-full flex justify-center mb-4">
       
      </div>
      <div className="w-full flex">
        <div className="w-1/2 px-10">
          <div className="h-16 flex items-center relative">
            <div
              className="h-11 bg-primary rounded-full w-11 bg-cover bg-center"
              style={{ backgroundImage: `url("${footerData.logoUrl}")` }}
            ></div>
            <ImageInput
              handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
              section={"logo"}
              top="-top-0.5"
            />
            
            <TextInput className="ml-4 font-bold outline-none" value={footerData.groupName} onChange={e=>handleFieldChange("groupName",e.target.value)} />
          </div>
          <TextInput
            type="textarea"
            className="w-full text-base text-secondary-paragraph outline-none bg-transparent resize-none"
            value={footerData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Nhập mô tả"
            rows="3"
          ></TextInput>
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
          {footerData.socialLinks.map((link) => (
            <div key={link.id} className="flex gap-2 mb-2 items-center">
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

export default Footer;