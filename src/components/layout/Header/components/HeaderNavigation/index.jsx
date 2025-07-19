import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { TextInput } from '../../../../Inputs/TextInput';

const HeaderNavigation = ({
  page,
  globalData,
  updateGlobalData,
  debouncedUpdateGlobalData,
  isDropdownOpen,
  toggleDropdown,
}) => {
  const [navigation, setNavigation] = useState(
    globalData?.navigation
      ? globalData.navigation.map((nav, index) => ({
          id: nav.id || `page_${index}`,
          name: nav.name,
          url: nav.url,
        }))
      : [
          { id: 'page_0', name: 'Trang chủ', url: '/Canary-Charity-Club/' },
          {
            id: 'page_1',
            name: 'Về Canary',
            url: '/Canary-Charity-Club/#/about',
          },
          {
            id: 'page_2',
            name: 'Sự kiện',
            url: '/Canary-Charity-Club/#/events',
          },
          {
            id: 'page_3',
            name: 'Câu chuyện',
            url: '/Canary-Charity-Club/#/stories',
          },
          {
            id: 'page_4',
            name: 'Ủng hộ',
            url: '/Canary-Charity-Club/#/donate',
          },
        ]
  );

  // const handleNavChange = useCallback((id, field, value) => {
  //   const updated = navigation.map((nav) => (nav.id === id ? { ...nav, [field]: value } : nav));
  //   setNavigation(updated);
  //   debouncedUpdateGlobalData({ navigation: updated });
  // }, [navigation]);

  // const addNavLink = () => {
  //   const newLink = { id: `page_${navigation.length}`, name: '', url: '' };
  //   const updated = [...navigation, newLink];
  //   setNavigation(updated);
  //   updateGlobalData({ navigation: updated });
  // };

  // const deleteNavLink = (id) => {
  //   const updated = navigation.filter((nav) => nav.id !== id);
  //   setNavigation(updated);
  //   updateGlobalData({ navigation: updated });
  // };

  return (
    <div className="flex justify-between items-center h-full px-4">
      <div className="hidden md:block flex-grow">
        <ul className="flex justify-center h-full">
          {navigation.map((nav) => (
            <li key={nav.id} className="w-28 h-full flex items-center">
              <a
                href={nav.url}
                className={
                  page === nav.url.split('#/')[1] ||
                  (page === 'home' && nav.url === '/Canary-Charity-Club#/')
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
  );
};

HeaderNavigation.propTypes = {
  page: PropTypes.string,
  globalData: PropTypes.object,
  updateGlobalData: PropTypes.func,
  debouncedUpdateGlobalData: PropTypes.func,
  isDropdownOpen: PropTypes.bool,
  toggleDropdown: PropTypes.func,
};

export default HeaderNavigation;
