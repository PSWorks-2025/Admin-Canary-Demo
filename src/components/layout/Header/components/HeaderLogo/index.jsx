import PropTypes from 'prop-types';
import { ImageInput } from '../../../../Inputs/ImageInput';

const HeaderLogo = ({ logoUrl, setLogoUrl, setLogoFile }) => {
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setLogoUrl(tempUrl);       // For preview only
    setLogoFile(file);      // For saving later
  };

  return (
    <ImageInput
      handleImageUpload={handleImageUpload}
      className="absolute left-5 sm:left-10 md:left-20 lg:left-36 w-20 h-20 bg-cover bg-center"
      style={{
        backgroundImage: `url("${logoUrl || 'https://blog.photobucket.com/hubfs/upload_pics_online.png'}")`,
      }}
      section="logo"
      top="-top-0.5"
    />
  );
};

HeaderLogo.propTypes = {
  logoUrl: PropTypes.string.isRequired,
  setLogoUrl: PropTypes.func.isRequired,
  setLogoFile: PropTypes.func.isRequired,
};

export default HeaderLogo;
