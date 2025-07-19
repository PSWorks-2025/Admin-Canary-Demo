import PropTypes from 'prop-types';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { GlobalProvider } from './GlobalData';
import LoadingScreen from './components/screens/LoadingScreen';
import { useContext } from 'react';
import GlobalContext from './GlobalData';

function Layout({ children, page }) {
  return (
    <GlobalProvider>
      <GlobalConsumerContent page={page}>{children}</GlobalConsumerContent>
    </GlobalProvider>
  );
}

const GlobalConsumerContent = ({ children, page }) => {
  const { loading, ...globalProps } = useContext(GlobalContext);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header page={page} {...globalProps} />
      {children}
      <Footer {...globalProps} />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
  page: PropTypes.string,
};

export default Layout;
