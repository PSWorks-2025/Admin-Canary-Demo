import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { ImageInput } from "../../../../Inputs/ImageInput";
import { TextInput } from "../../../../Inputs/TextInput";

const FooterLogoAndGroupInfo = ({
  logoUrl,
  setLogoUrl,
  setLogoFile,
  groupName,
  setGroupName,
  groupDescription,
  setGroupDescription,
}) => {
  const handleLocalLogoChange = (file) => {
    if (!file) return;
    const tempUrl = URL.createObjectURL(file);
    setLogoFile(file); // for upload later
    setLogoUrl(tempUrl); // for immediate preview
  };

  return (
    <div className="w-full">
      <div className="h-16 flex items-center relative">
        <ImageInput
          handleImageUpload={(e) => handleLocalLogoChange(e.target.files[0])}
          className="h-11 w-11 bg-primary rounded-full bg-cover bg-center overflow-hidden flex-shrink-0"
          style={{
            backgroundImage: `url("${
              logoUrl ||
              "https://blog.photobucket.com/hubfs/upload_pics_online.png"
            }")`,
          }}
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

FooterLogoAndGroupInfo.propTypes = {
  logoUrl: PropTypes.string,
  setLogoUrl: PropTypes.func.isRequired,
  setLogoFile: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
  setGroupName: PropTypes.func.isRequired,
  groupDescription: PropTypes.string.isRequired,
  setGroupDescription: PropTypes.func.isRequired,
};

export default FooterLogoAndGroupInfo;
