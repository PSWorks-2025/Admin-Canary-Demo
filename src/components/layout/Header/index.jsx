import PropTypes from 'prop-types';
import { useState, useCallback, memo, useContext } from 'react';
import HeaderLogo from './components/HeaderLogo';
import HeaderNavigation from './components/HeaderNavigation';
import GlobalContext from '../../../GlobalContext';

const Header = ({ page }) => {
  const {
    logoUrl,
    setLogoUrl,
    setLogoFile,
    primaryBackgroundColor,
    globalData,
  } = useContext(GlobalContext);

  return (
    <header
      className="w-full h-16 sm:h-20 fixed top-0 z-50 shadow-md shadow-gray-200 text-primary-paragraph"
      style={{ backgroundColor: primaryBackgroundColor }}
    >
      <div className="w-full h-full flex flex-row justify-center sm:px-6 lg:px-8">
        <HeaderLogo />
        <HeaderNavigation page={page} globalData={globalData} />
      </div>
    </header>
  );
};

Header.propTypes = {
  page: PropTypes.string,
};

export default memo(Header);
