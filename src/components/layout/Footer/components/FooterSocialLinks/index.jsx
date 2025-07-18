import { useCallback, useEffect, useState } from "react";
import { TextInput } from "../../../../Inputs/TextInput";
import PropTypes from "prop-types";

// Debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const FooterSocialLinks = ({ data, setData, updateGlobalData }) => {
  const [socialLinks, setSocialLinks] = useState([]);

  // Convert object to internal array format on mount or when data changes
  useEffect(() => {
    const formatted = data
      ? Object.entries(data).map(([name, url], index) => ({
          id: `link_${index}`,
          name: name.charAt(0).toUpperCase() + name.slice(1),
          url,
        }))
      : [];
    setSocialLinks(formatted);
  }, [data]);

  const debouncedUpdateGlobalData = useCallback(debounce(updateGlobalData, 1500), [updateGlobalData]);

  const handleSocialLinkChange = useCallback((id, field, value) => {
    setSocialLinks((prevLinks) => {
      const newSocialLinks = prevLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      );

      const updatedObject = newSocialLinks.reduce((acc, link) => ({
        ...acc,
        [link.name.toLowerCase()]: link.url,
      }), {});

      setData(updatedObject);
      debouncedUpdateGlobalData({ social_media: updatedObject });

      return newSocialLinks;
    });
  }, [debouncedUpdateGlobalData, setData]);

  const addSocialLink = useCallback(() => {
    const newId = `link_${socialLinks.length}`;
    const newLink = { id: newId, name: "", url: "" };
    const updatedLinks = [...socialLinks, newLink];

    const updatedObject = {
      ...updatedLinks.reduce((acc, link) => ({
        ...acc,
        [link.name.toLowerCase()]: link.url,
      }), {}),
    };

    setSocialLinks(updatedLinks);
    setData(updatedObject);
    updateGlobalData({ social_media: updatedObject });
  }, [socialLinks, setData, updateGlobalData]);

  const deleteSocialLink = useCallback((id) => {
    const newSocialLinks = socialLinks.filter((link) => link.id !== id);
    const updatedObject = newSocialLinks.reduce((acc, link) => ({
      ...acc,
      [link.name.toLowerCase()]: link.url,
    }), {});

    setSocialLinks(newSocialLinks);
    setData(updatedObject);
    updateGlobalData({ social_media: updatedObject });
  }, [socialLinks, setData, updateGlobalData]);

  return (
    <div className="w-full [&>a]:block [&>a]:hover:text-secondary-hover [&>a]:transition">
      <div className="h-16 flex items-center font-bold">Truyền thông</div>
      {socialLinks.map((link) => (
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
            className="text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
            value={link.name}
            onChange={(e) => handleSocialLinkChange(link.id, "name", e.target.value)}
            placeholder="Tên mạng xã hội"
          />
          <TextInput
            className="text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
            value={link.url}
            onChange={(e) => handleSocialLinkChange(link.id, "url", e.target.value)}
            placeholder="Liên kết mạng xã hội"
          />
          <button
            onClick={() => deleteSocialLink(link.id)}
            className="p-1 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600"
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
        className="py-2 px-5 rounded-full cursor-pointer font-semibold bg-secondary-darken text-secondary-title mt-2 hover:opacity-80"
      >
        Thêm liên kết
      </button>
    </div>
  );
};

FooterSocialLinks.propTypes = {
  data: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  updateGlobalData: PropTypes.func.isRequired,
};

export default FooterSocialLinks;
