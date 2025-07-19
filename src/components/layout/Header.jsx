import PropTypes from 'prop-types';
import { useState, useCallback, memo, useContext } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../service/firebaseConfig';
import HeaderLogo from './Header/components/HeaderLogo';
import MainColorPicker from './Header/components/MainColorPicker';
import HeaderNavigation from './Header/components/HeaderNavigation';
import GlobalContext from '../../GlobalData';

const Header = ({ page }) => {
  const {
    logoUrl,
    setLogoUrl,
    setLogoFile,
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
    setPrimaryBackgroundColor,
    setSecondaryBackgroundColor,
    setTertiaryBackgroundColor,
    globalData,
  } = useContext(GlobalContext);

  // const debounce = (func, wait) => {
  //   // this is to prevent constant, rapid fire updates (like when a user is typing)
  //   let timeout;
  //   return (...args) => {
  //     clearTimeout(timeout);
  //     timeout = setTimeout(() => func(...args), wait);
  //   };
  // };

  // const updateGlobalData = useCallback(
  //   async (updates) => {
  //     try {
  //       const updatedData = { ...globalData, ...updates };
  //       setGlobalData(updatedData);
  //       const docRef = doc(db, 'Global', 'components');
  //       await updateDoc(docRef, updatedData);
  //       console.log('Firestore updated successfully:', updatedData);
  //     } catch (error) {
  //       console.error('Error updating Firestore:', error);
  //       setGlobalData(globalData);
  //     }
  //   },
  //   [globalData, setGlobalData]
  // );

  // const debouncedUpdateGlobalData = useCallback(
  //   debounce(updateGlobalData, 1500),
  //   [updateGlobalData]
  // );

  return (
    <div
      className="w-full h-20 shadow-md shadow-gray-200 text-primary-paragraph"
      style={{ backgroundColor: secondaryBackgroundColor }}
    >
      <div className="relative w-full h-full">
        <HeaderLogo
          logoUrl={logoUrl}
          setLogoUrl={setLogoUrl}
          setLogoFile={setLogoFile}
        />
        <MainColorPicker
          primaryBackgroundColor={primaryBackgroundColor}
          setPrimaryBackgroundColor={setPrimaryBackgroundColor}
          secondaryBackgroundColor={secondaryBackgroundColor}
          setSecondaryBackgroundColor={setSecondaryBackgroundColor}
          tertiaryBackgroundColor={tertiaryBackgroundColor}
          setTertiaryBackgroundColor={setTertiaryBackgroundColor}
        />
        <HeaderNavigation page={page} globalData={globalData} />
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
