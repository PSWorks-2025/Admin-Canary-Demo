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
    setLogoUrl(tempUrl); // Temporary preview

    enqueueImageUpload({
      key: 'global.logo',
      path: 'global/logo',
      file,
    });
  };

  return (
    <ImageInput
      handleImageUpload={handleImageUpload}
      className="absolute top-2 left-4 sm:left-6 md:left-8 lg:left-12 w-12 h-12 sm:w-16 sm:h-16 bg-cover bg-center rounded-full"
      // imagePreview={logoUrl}
      section="logo"
      top="top-2 sm:top-2"
      style={{ backgroundImage: `url(${logoUrl || "https://blog.photobucket.com/hubfs/upload_pics_online.png"})` }}
    />
  );
};

export default HeaderLogo;