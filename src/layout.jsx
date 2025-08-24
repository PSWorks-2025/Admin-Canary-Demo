import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useLocation } from 'react-router';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/screens/LoadingScreen';

import GlobalContext from './GlobalContext.jsx';
import { GlobalProvider } from './GlobalContext.jsx';
import SaveFloatingButton from './globalComponent/SaveButton';
import MainColorPicker from './components/layout/MainColorPicker/index.jsx';
import HeaderEditor from '../Section-And-Core-Component/CanarySectionsModel/Header/HeaderEditor/index.jsx';
import FooterEditor from '../Section-And-Core-Component/CanarySectionsModel/Footer/FooterEditor/index.jsx';

const Layout = ({ children }) => {
  return (
    <GlobalProvider>
      <LayoutContent>{children}</LayoutContent>
    </GlobalProvider>
  );
};

const LayoutContent = ({ children }) => {
  const { loading, handleGlobalSave, ...globalProps } =
    useContext(GlobalContext);
  const location = useLocation();

  // Derive `page` from pathname
  const page = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className='w-full max-w-full'>
      <HeaderEditor page={page} GlobalContext={GlobalContext} {...globalProps} />
      {children}
      <FooterEditor GlobalContext={GlobalContext} {...globalProps} />
      {location.pathname !== '/edit-content' && (
        <SaveFloatingButton visible={true} onClick={handleGlobalSave} />
      )}
      <MainColorPicker/>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

LayoutContent.propTypes = {
  children: PropTypes.node,
};

export default Layout;