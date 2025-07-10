import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import logo from '/images/logo.png';

function Header({ page }) {
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
      style={{ backgroundColor: headerData.backgroundColor }}
    >
      <div className="relative w-full h-full">
        <div
          className="absolute left-5 sm:left-10 md:left-20 lg:left-36 w-20 h-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${headerData.logoUrl}")` }}
        >
          <button
            className="absolute top-0 left-0 pb-1.5 pl-1 pr-1 bg-secondary text-secondary-title rounded-full cursor-pointer z-10"
            onClick={() => fileInputRef.current.click()}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4 4m0 0l-4 4m4-4H7"
              />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleLogoUpload(e.target.files[0])}
          />
        </div>
        <div className="absolute top-2 right-2">
          <input
            type="color"
            value={headerData.backgroundColor}
            onChange={(e) => handleBackgroundColorChange(e.target.value)}
            className="w-8 h-8 rounded-full cursor-pointer"
          />
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
};

export default Header;