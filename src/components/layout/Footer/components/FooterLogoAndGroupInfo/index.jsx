import PropTypes from 'prop-types';
import { useContext } from 'react';
import GlobalContext from '../../../../../GlobalContext';
import { ImageInput } from '../../../../Inputs/ImageInput';
import { TextInput } from '../../../../Inputs/TextInput';

const FooterLogoAndGroupInfo = ({
  groupName,
  setGroupName,
  groupDescription,
  setGroupDescription,
}) => {
  const { logoUrl, setLogoUrl, enqueueImageUpload } = useContext(GlobalContext);

  const handleLogoUpload = (file) => {
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setLogoUrl(tempUrl); // Preview ngay
    enqueueImageUpload({
      key: 'global.logo',
      path: 'global/logo',
      file,
    }); // Thêm vào hàng đợi
  };

  return (
    <div className="w-full">
      <div className="h-16 flex items-center relative">
        <ImageInput
          handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
          className="h-11 w-11 bg-primary rounded-full bg-cover bg-center overflow-hidden flex-shrink-0"
          imagePreview={logoUrl}
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
  groupName: PropTypes.string.isRequired,
  setGroupName: PropTypes.func.isRequired,
  groupDescription: PropTypes.string.isRequired,
  setGroupDescription: PropTypes.func.isRequired,
};

export default FooterLogoAndGroupInfo;