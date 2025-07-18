import { useCallback } from "react";
import { TextInput } from "../../../../Inputs/TextInput";
import PropTypes from "prop-types";

const FooterContactInfo = ({ data, setData }) => {
  const handleFieldChange = useCallback((field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, [setData]);

  return (
    <div className="w-full">
      <TextInput
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
        value={data.hotline}
        onChange={(e) => handleFieldChange("hotline", e.target.value)}
        placeholder="Nhập số hotline"
      />
      <TextInput
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
        value={data.email}
        onChange={(e) => handleFieldChange("email", e.target.value)}
        placeholder="Nhập email"
      />
      <TextInput
        className="w-full text-base text-secondary-paragraph outline-none bg-transparent rounded px-2 py-1"
        value={data.address}
        onChange={(e) => handleFieldChange("address", e.target.value)}
        placeholder="Nhập địa chỉ"
      />
    </div>
  );
};

FooterContactInfo.propTypes = {
  data: PropTypes.shape({
    hotline: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
  }),
  setData: PropTypes.func.isRequired,
};

export default FooterContactInfo;
