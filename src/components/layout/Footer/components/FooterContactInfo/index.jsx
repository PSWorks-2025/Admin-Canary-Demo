import { TextInput } from "../../../../Inputs/TextInput";
import PropTypes from "prop-types";

const FooterContactInfo = ({ contactInfoData, setContactInfoData }) => {
  const handleFieldChange = (field, value) => {
    setContactInfoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full space-y-2">
      <TextInput
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
        value={contactInfoData.hotline}
        onChange={(e) => handleFieldChange("hotline", e.target.value)}
        placeholder="Nhập số hotline"
      />
      <TextInput
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
        value={contactInfoData.email}
        onChange={(e) => handleFieldChange("email", e.target.value)}
        placeholder="Nhập email"
      />
      <TextInput
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
        value={contactInfoData.address}
        onChange={(e) => handleFieldChange("address", e.target.value)}
        placeholder="Nhập địa chỉ"
      />
    </div>
  );
};

FooterContactInfo.propTypes = {
  contactInfoData: PropTypes.shape({
    hotline: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  setContactInfoData: PropTypes.func.isRequired,
};

export default FooterContactInfo;