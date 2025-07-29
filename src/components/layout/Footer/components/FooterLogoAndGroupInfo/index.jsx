import { useCallback, useEffect, useState } from "react";
import { TextInput } from "../../../../Inputs/TextInput";
import PropTypes from "prop-types";

const FooterSocialLinks = ({ socialLinksData, setSocialLinksData }) => {
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const formatted = socialLinksData
      ? Object.entries(socialLinksData).map(([name, url], index) => ({
          id: `link_${index}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          url,
        }))
      : [];
    setSocialLinks(formatted);
  }, [socialLinksData]);

  const handleSocialLinkChange = useCallback((id, field, value) => {
    setSocialLinks((prevLinks) => {
      const newSocialLinks = prevLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      );

      const updatedObject = newSocialLinks.reduce((acc, link) => {
        if (link.name.trim()) {
          acc[link.name.toLowerCase()] = link.url;
        }
        return acc;
      }, {});

      setSocialLinksData(updatedObject);
      return newSocialLinks;
    });
  }, [setSocialLinksData]);

  const addSocialLink = useCallback(() => {
    const newId = `link_${socialLinks.length}`;
    const updatedLinks = [...socialLinks, { id: newId, name: "", url: "" }];

    setSocialLinks(updatedLinks);
  }, [socialLinks]);

  const deleteSocialLink = useCallback((id) => {
    const newSocialLinks = socialLinks.filter((link) => link.id !== id);
    const updatedObject = newSocialLinks.reduce((acc, link) => {
      if (link.name.trim()) {
        acc[link.name.toLowerCase()] = link.url;
      }
      return acc;
    }, {});

    setSocialLinks(newSocialLinks);
    setSocialLinksData(updatedObject);
  }, [socialLinks, setSocialLinksData]);

  return (
    <div className="w-full">
      <div className="h-16 flex items-center relative">
        <ImageInput
          handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
          className="h-11 w-11 bg-primary rounded-full bg-cover bg-center overflow-hidden flex-shrink-0"
          // src={logoUrl}
      style={{ backgroundImage: `url(${logoUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"})` }}
          section="logo"
        />
        <TextInput
          className="ml-4 font-bold outline-none bg-transparent rounded px-2 py-1"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Nhập tên nhóm"
        />
      </div>
      <TextInput
        type="textarea"
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent resize-none rounded px-2 py-1"
        value={groupDescription}
        onChange={(e) => setGroupDescription(e.target.value)}
        placeholder="Nhập mô tả"
        rows="3"
      />
    </div>
  );
};

FooterSocialLinks.propTypes = {
  socialLinksData: PropTypes.object.isRequired,
  setSocialLinksData: PropTypes.func.isRequired,
};

export default FooterSocialLinks;