import { useCallback } from "react";
import { ImageInput } from "../../../../Inputs/ImageInput";
import { TextInput } from "../../../../Inputs/TextInput";
import PropTypes from "prop-types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../../service/firebaseConfig";


const FooterLogoAndGroupInfo = ({ data, setData }) => {
  const handleFieldChange = useCallback((field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, [setData]);

  const handleLogoUpload = useCallback(async (file) => {
    if (file instanceof File) {
      try {
        const storageRef = ref(storage, `footer/${file.name}`);
        await uploadBytes(storageRef, file);
        const logoUrl = await getDownloadURL(storageRef);
        setData((prevData) => ({
          ...prevData,
          logo_footer: logoUrl,
        }));
      } catch (error) {
        console.error("Error uploading logo:", error);
      }
    }
  }, [setData]);

  return (
    <div className="w-full">
      <div className="h-16 flex items-center relative">
        <ImageInput
          handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
          className="h-11 w-11 bg-primary rounded-full bg-cover bg-center overflow-hidden flex-shrink-0"
          style={{
            backgroundImage: `url("${data.logo || "https://blog.photobucket.com/hubfs/upload_pics_online.png"}")`,
          }}
          section="logo"
        />
        <TextInput
          className="ml-4 font-bold outline-none bg-transparent rounded px-2 py-1"
          value={data.group_name}
          onChange={(e) => handleFieldChange("group_name", e.target.value)}
          placeholder="Nhập tên nhóm"
        />
      </div>
      <TextInput
        type="textarea"
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent resize-none rounded px-2 py-1"
        value={data.description}
        onChange={(e) => handleFieldChange("description", e.target.value)}
        placeholder="Nhập mô tả"
        rows="3"
      />
    </div>
  );
};

FooterLogoAndGroupInfo.propTypes = {
  data: PropTypes.shape({
    group_name: PropTypes.string,
    description: PropTypes.string,
    logo_footer: PropTypes.string,
  }),
  setData: PropTypes.func.isRequired,
};

export default FooterLogoAndGroupInfo;
