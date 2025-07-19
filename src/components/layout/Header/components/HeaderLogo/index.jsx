import { useCallback, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../../service/firebaseConfig';
import { ImageInput } from '../../../../Inputs/ImageInput';
import PropTypes from 'prop-types';

const HeaderLogo = ({ globalData, updateGlobalData }) => {
  const [logoUrl, setLogoUrl] = useState(globalData?.logo || '');

  const handleLogoUpload = useCallback(async (file) => {
    if (!file) return;
    try {
      const storageRef = ref(storage, `header/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setLogoUrl(url);
      updateGlobalData({ logo: url });
      console.log('Logo uploaded:', url);
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  }, [updateGlobalData]);

  return (
    <ImageInput
      handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
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
  globalData: PropTypes.object.isRequired,
  updateGlobalData: PropTypes.func.isRequired,
};

export default HeaderLogo;
