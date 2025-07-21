import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ImageInput } from '../../../../Inputs/ImageInput';
import GlobalContext from '../../../../../GlobalContext';

const HeaderLogo = () => {
  const { enqueueImageUpload, setLogoUrl, logoUrl } = useContext(GlobalContext);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setLogoUrl(tempUrl); // Hiển thị preview tạm thời

    enqueueImageUpload("logo", "globaldata/logo", file);
  };

  return (
    <ImageInput
      handleImageUpload={handleImageUpload}
      className="absolute left-5 sm:left-10 md:left-20 lg:left-36 w-20 h-20 bg-cover bg-center"
      imagePreview={logoUrl}
      section="logo"
      top="-top-0.5"
    />
  );
};

HeaderLogo.propTypes = {
  logoUrl: PropTypes.string.isRequired,
};

export default HeaderLogo;
