import PropTypes from 'prop-types';
import { useState } from 'react';

const HeaderNavigation = ({ page, globalData }) => {
  const [navigation, setNavigation] = useState(
    globalData?.navigation
      ? globalData.navigation.map((nav, index) => ({
          id: nav.id || `page_${index}`,
          name: nav.name,
          url: nav.url,
        }))
      : [
          {
            id: 'page_0',
            name: 'Trang chủ',
            url: '/Admin-Canary-Demo/#/',
          },
          {
            id: 'page_1',
            name: 'Về Canary',
            url: '/Admin-Canary-Demo/#/about',
          },
          {
            id: 'page_2',
            name: 'Sự kiện',
            url: '/Admin-Canary-Demo/#/events',
          },
          {
            id: 'page_3',
            name: 'Câu chuyện',
            url: '/Admin-Canary-Demo/#/stories',
          },
          {
            id: 'page_4',
            name: 'Ủng hộ',
            url: '/Admin-Canary-Demo/#/donate',
          },
        ]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="flex items-center h-full">
      {/* Desktop Navigation */}
      <div className="hidden md:block flex-grow">
        <ul className="flex justify-center items-center h-full space-x-4 lg:space-x-8">
          {navigation.map((nav) => {
            // Normalize the URL for comparison
            const navPath = nav.url.includes('#/') 
              ? nav.url.split('#/')[1] || 'home' 
              : nav.url === '/Admin-Canary-Demo/' 
                ? 'home' 
                : nav.url;
            return (
              <li key={nav.id} className="flex items-center">
                <a
                  href={nav.url}
                  className={
                    page === navPath
                      ? 'text-secondary font-bold hover:text-secondary-hover text-sm lg:text-base'
                      : 'hover:text-primary-hover text-sm lg:text-base'
                  }
                >
                  {nav.name}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute right-4 sm:right-6">
        <button
          onClick={toggleDropdown}
          className="text-primary-paragraph focus:outline-none text-lg"
          aria-label="Toggle navigation menu"
        >
          <i className="fas fa-bars"></i>
        </button>
        {isDropdownOpen && (
          <div className="absolute top-16 right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
            <ul className="flex flex-col">
              {navigation.map((nav) => {
                // Normalize the URL for comparison
                const navPath = nav.url.includes('#/') 
                  ? nav.url.split('#/')[1] || 'home' 
                  : nav.url === '/Admin-Canary-Demo/' 
                    ? 'home' 
                    : nav.url;
                return (
                  <li key={nav.id} className="px-4 py-2">
                    <a
                      href={nav.url}
                      onClick={() => setIsDropdownOpen(false)}
                      className={
                        page === navPath
                          ? 'text-secondary font-bold hover:text-secondary-hover text-sm'
                          : 'hover:text-primary-hover text-sm'
                      }
                    >
                      {nav.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

HeaderNavigation.propTypes = {
  page: PropTypes.string,
  globalData: PropTypes.object,
};

export default HeaderNavigation;