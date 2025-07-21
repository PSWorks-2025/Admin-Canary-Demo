import PropTypes from 'prop-types';
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/screens/LoadingScreen';

import GlobalContext from './GlobalContext.jsx';
import { GlobalProvider } from './GlobalContext.jsx';
import SaveFloatingButton from './globalComponent/SaveButton';

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
    <>
      <Header page={page} {...globalProps} />
      {children}
      <Footer {...globalProps} />
      <SaveFloatingButton visible onSave={handleGlobalSave} />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

LayoutContent.propTypes = {
  children: PropTypes.node,
};

export default Layout;
