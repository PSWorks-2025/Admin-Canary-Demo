import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import logo from '/images/logo.png';
import { ImageInput } from '../Inputs/ImageInput';
import { TextInput } from '../Inputs/TextInput';
import ColorInput from '../Inputs/ColorInput';

function Header({ page, setPrimaryBackgroundColor,secondaryBackgroundColor, setSecondaryBackgroundColor, tertiaryBackgroundColor, setTertiaryBackgroundColor }) {
  const [headerData, setHeaderData] = useState({
    backgroundColor: "#ffffff", // Default background color (primary)
    logoUrl: logo,
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pages = [
    'home.Trang chủ',
    'about.Về Canary',
    'events.Sự kiện',
    'stories.Câu chuyện',
    // 'donate.Ủng hộ',
  ];
  const baseName = '/Canary-Charity-Club/';
  const fileInputRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderData((prevData) => ({
          ...prevData,
          logoUrl: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundColorChange = (value) => {
    setHeaderData((prevData) => ({
      ...prevData,
      backgroundColor: value,
    }));
  };

  return (
    <div
      className="w-full h-20 shadow-md shadow-gray-200 text-primary-paragraph"
      style={{ backgroundColor: secondaryBackgroundColor }}
    >
      <div className="relative w-full h-full">
        <div
          className="absolute left-5 sm:left-10 md:left-20 lg:left-36 w-20 h-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${headerData.logoUrl}")` }}
        >
          <ImageInput
            handleImageUpload={(e) => handleLogoUpload(e.target.files[0])}
            section={"logo"}
            top="-top-0.5"
          />
        </div>
        <div className="absolute top-7 right-2 flex items-center justify-center space-x-2">
          <label className="text-sm">
            Background color:
            <ColorInput
              type="color"
              value={headerData.backgroundColor}
              onChange={(e) => {
                handleBackgroundColorChange(e.target.value);
                setPrimaryBackgroundColor(e.target.value);
              }}
              className="ml-1 w-6 h-6"
            />
          </label>
          <label className="text-sm">
            Header and button:
            <ColorInput
              type="color"
              value={secondaryBackgroundColor}
              onChange={(e) => setSecondaryBackgroundColor(e.target.value)}
              className="ml-1 w-6 h-6"
            />
          </label>
          <label className="text-sm">
            Footer:
            <ColorInput
              type="color"
              value={tertiaryBackgroundColor}
              onChange={(e) => setTertiaryBackgroundColor(e.target.value)}
              className="ml-1 w-6 h-6"
            />
          </label>
        </div>
        <div className="flex justify-between items-center h-full px-4">
          <div className="hidden md:block flex-grow">
            <ul className="flex justify-center h-full">
              {pages
                .map((page) => page.split('.'))
                .map((pg, index) => (
                  <li key={`page_${index}`} className="w-28 h-full">
                    <a
                      href={pg[0] === "home" ? `${baseName}#/` : `${baseName}#/${pg[0]}`}
                      className={
                        page === pg[0]
                          ? 'text-secondary font-bold hover:text-secondary-hover'
                          : 'hover:text-primary-hover'
                      }
                    >
                      {pg[1]}
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
        {isDropdownOpen && (
          <div className="block md:hidden absolute left-0 right-0 bg-primary">
            <ul className="flex flex-col items-center">
              {pages
                .map((page) => page.split('.'))
                .map((pg, index) => (
                  <li key={`dropdown_page_${index}`} className="w-full text-center">
                    <a
                      href={pg[0] === "home" ? `${baseName}#/` : `${baseName}#/${pg[0]}`}
                      className={
                        page === pg[0]
                          ? 'text-secondary font-bold hover:text-secondary-hover block py-2'
                          : 'hover:text-primary-hover block py-2'
                      }
                    >
                      {pg[1]}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

Header.propTypes = {
  page: PropTypes.string,
  setPrimaryBackgroundColor: PropTypes.func,
  secondaryBackgroundColor: PropTypes.string,
  setSecondaryBackgroundColor: PropTypes.func,
  setTertiaryBackgroundColor: PropTypes.func,
};

export default Header;