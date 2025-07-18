import PropTypes from 'prop-types';
import { useState, useCallback, memo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db,storage } from '../../service/firebaseConfig';
import { ImageInput } from '../Inputs/ImageInput';
import { TextInput } from '../Inputs/TextInput';
import ColorInput from '../Inputs/ColorInput';

const Header = ({
  page,
  setPrimaryBackgroundColor,
  secondaryBackgroundColor,
  setSecondaryBackgroundColor,
  tertiaryBackgroundColor,
  setTertiaryBackgroundColor,
  globalData,
  setGlobalData,
}) => {
  const [headerData, setHeaderData] = useState({
    backgroundColor: globalData?.primaryBackgroundColor || "#ffffff",
    logoUrl: globalData?.logo || 'https://i.ibb.co/kVQhWyjz/logo.png',
    navigation: globalData?.navigation
      ? globalData.navigation.map((nav, index) => ({
          id: nav.id || `page_${index}`,
          name: nav.name,
          url: nav.url,
        }))
      : [
          { id: 'page_0', name: 'Trang chủ', url: '/Canary-Charity-Club/' },
          { id: 'page_1', name: 'Về Canary', url: '/Canary-Charity-Club/#/about' },
          { id: 'page_2', name: 'Sự kiện', url: '/Canary-Charity-Club/#/events' },
          { id: 'page_3', name: 'Câu chuyện', url: '/Canary-Charity-Club/#/stories' },
          { id: 'page_4', name: 'Ủng hộ', url: '/Canary-Charity-Club/#/donate' },
        ],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debounce utility
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Update Firestore
  const updateGlobalData = useCallback(async (updates) => {
    try {
      const updatedData = { ...globalData, ...updates };
      setGlobalData(updatedData);
      const docRef = doc(db, 'Global', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully:', updatedData);
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setGlobalData(globalData); // Revert on error
    }
  }, [globalData, setGlobalData]);

  const debouncedUpdateGlobalData = useCallback(debounce(updateGlobalData, 1500), [updateGlobalData]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoUpload = useCallback(async (file) => {
    if (file instanceof File) {
      try {
        const storageRef = ref(storage, `header/${file.name}`);
        await uploadBytes(storageRef, file);
        const logoUrl = await getDownloadURL(storageRef);
        setHeaderData((prevData) => ({
          ...prevData,
          logoUrl,
        }));
        await updateGlobalData({
          logo: logoUrl,
        });
        console.log('Logo uploaded:', logoUrl);
      } catch (error) {
        console.error('Error uploading logo:', error);
      }
    }
  }, [updateGlobalData]);

  const handleBackgroundColorChange = useCallback((field, value) => {
    console.log('Header handleBackgroundColorChange:', { field, value });
    setHeaderData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    if (field === 'backgroundColor') {
      setPrimaryBackgroundColor(value);
      debouncedUpdateGlobalData({ primaryBackgroundColor: value });
    } else if (field === 'secondaryBackgroundColor') {
      setSecondaryBackgroundColor(value);
      debouncedUpdateGlobalData({ secondaryBackgroundColor: value });
    } else if (field === 'tertiaryBackgroundColor') {
      setTertiaryBackgroundColor(value);
      debouncedUpdateGlobalData({ tertiaryBackgroundColor: value });
    }
  }, [
    setPrimaryBackgroundColor,
    setSecondaryBackgroundColor,
    setTertiaryBackgroundColor,
    debouncedUpdateGlobalData,
  ]);

  const handleNavChange = useCallback((id, field, value) => {
    console.log('Header handleNavChange:', { id, field, value });
    setHeaderData((prevData) => {
      const newNavigation = prevData.navigation.map((nav) =>
        nav.id === id ? { ...nav, [field]: value } : nav
      );
      return { ...prevData, navigation: newNavigation };
    });
    debouncedUpdateGlobalData({
      navigation: headerData.navigation.map((nav) =>
        nav.id === id ? { ...nav, [field]: value } : nav
      ),
    });
  }, [headerData.navigation, debouncedUpdateGlobalData]);

  const addNavLink = useCallback(() => {
    const newId = `page_${headerData.navigation.length}`;
    const newNav = { id: newId, name: '', url: '' };
    setHeaderData((prevData) => ({
      ...prevData,
      navigation: [...prevData.navigation, newNav],
    }));
    updateGlobalData({
      navigation: [...headerData.navigation, newNav],
    });
    console.log('New nav link added:', newNav);
  }, [headerData.navigation, updateGlobalData]);

  const deleteNavLink = useCallback((id) => {
    console.log('Header deleteNavLink:', { id });
    setHeaderData((prevData) => ({
      ...prevData,
      navigation: prevData.navigation.filter((nav) => nav.id !== id),
    }));
    updateGlobalData({
      navigation: headerData.navigation.filter((nav) => nav.id !== id),
    });
  }, [headerData.navigation, updateGlobalData]);

  console.log('Header rendered:', headerData);

  return (
    <div
      className="w-full h-20 shadow-md shadow-gray-200 text-primary-paragraph"
      style={{ backgroundColor: secondaryBackgroundColor }}
    >
      <div className="relative w-full h-full">
        {/* <div
          className="absolute left-5 sm:left-10 md:left-20 lg:left-36 w-20 h-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${headerData.logoUrl}")` }}
        > */}
          <ImageInput
            handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
            className={"absolute left-5 sm:left-10 md:left-20 lg:left-36 w-20 h-20 bg-cover bg-center"}
            style={{backgroundImage:`url("${headerData.logoUrl || 'https://blog.photobucket.com/hubfs/upload_pics_online.png'}")`}}
            section="logo"
            top="-top-0.5"
          />
        {/* </div> */}
        <div className="absolute top-7 right-2 flex items-center justify-center space-x-2">
          <div className="flex space-x-2">
            <label className="text-sm">
              Background color:
              <ColorInput
                type="color"
                value={headerData.backgroundColor}
                onChange={(e) => handleBackgroundColorChange('backgroundColor', e.target.value)}
                className="ml-1 w-6 h-6"
              />
            </label>
            <label className="text-sm">
              Header and button:
              <ColorInput
                type="color"
                value={secondaryBackgroundColor}
                onChange={(e) => handleBackgroundColorChange('secondaryBackgroundColor', e.target.value)}
                className="ml-1 w-6 h-6"
              />
            </label>
            <label className="text-sm">
              Footer:
              <ColorInput
                type="color"
                value={tertiaryBackgroundColor}
                onChange={(e) => handleBackgroundColorChange('tertiaryBackgroundColor', e.target.value)}
                className="ml-1 w-6 h-6"
              />
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center h-full px-4">
          <div className="hidden md:block flex-grow">
            <ul className="flex justify-center h-full">
              {headerData.navigation.map((nav) => (
                <li key={nav.id} className="w-28 h-full flex items-center">
                  <a
                    href={nav.url}
                    className={
                      page === nav.url.split('#/')[1] || (page === 'home' && nav.url === '/Canary-Charity-Club#/')
                        ? 'text-secondary font-bold hover:text-secondary-hover'
                        : 'hover:text-primary-hover'
                    }
                  >
                    {nav.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:hidden absolute right-10">
            <button
              onClick={toggleDropdown}
              className="text-primary-paragraph focus:outline-none"
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      
      </div>
    </div>
  );
};

Header.propTypes = {
  page: PropTypes.string,
  setPrimaryBackgroundColor: PropTypes.func,
  secondaryBackgroundColor: PropTypes.string,
  setSecondaryBackgroundColor: PropTypes.func,
  tertiaryBackgroundColor: PropTypes.string,
  setTertiaryBackgroundColor: PropTypes.func,
  globalData: PropTypes.shape({
    logo: PropTypes.string,
    primaryBackgroundColor: PropTypes.string,
    secondaryBackgroundColor: PropTypes.string,
    tertiaryBackgroundColor: PropTypes.string,
    navigation: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string,
      })
    ),
  }),
  setGlobalData: PropTypes.func,
};

export default memo(Header);