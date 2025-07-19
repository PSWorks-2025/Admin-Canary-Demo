import PropTypes from 'prop-types';
import { useState, useCallback, memo } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../service/firebaseConfig';
import HeaderLogo from './Header/components/HeaderLogo';
import MainColorPicker from './Header/components/MainColorPicker';
import HeaderNavigation from './Header/components/HeaderNavigation';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const updateGlobalData = useCallback(async (updates) => {
    try {
      const updatedData = { ...globalData, ...updates };
      setGlobalData(updatedData);
      const docRef = doc(db, 'Global', 'components');
      await updateDoc(docRef, updatedData);
      console.log('Firestore updated successfully:', updatedData);
    } catch (error) {
      console.error('Error updating Firestore:', error);
      setGlobalData(globalData);
    }
  }, [globalData, setGlobalData]);

  const debouncedUpdateGlobalData = useCallback(debounce(updateGlobalData, 1500), [updateGlobalData]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div
      className="w-full h-20 shadow-md shadow-gray-200 text-primary-paragraph"
      style={{ backgroundColor: secondaryBackgroundColor }}
    >
      <div className="relative w-full h-full">
        <HeaderLogo globalData={globalData} updateGlobalData={updateGlobalData} />
        <MainColorPicker
          globalData={globalData}
          setPrimaryBackgroundColor={setPrimaryBackgroundColor}
          setSecondaryBackgroundColor={setSecondaryBackgroundColor}
          setTertiaryBackgroundColor={setTertiaryBackgroundColor}
          debouncedUpdateGlobalData={debouncedUpdateGlobalData}
          secondaryBackgroundColor={secondaryBackgroundColor}
          tertiaryBackgroundColor={tertiaryBackgroundColor}
        />
        <HeaderNavigation
          page={page}
          globalData={globalData}
          updateGlobalData={updateGlobalData}
          debouncedUpdateGlobalData={debouncedUpdateGlobalData}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
        />
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
  globalData: PropTypes.object,
  setGlobalData: PropTypes.func,
};

export default memo(Header);
