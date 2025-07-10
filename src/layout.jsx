import PropTypes from "prop-types";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

function Layout({ children, page }) {
  return (
    <>
      <Header page={page}/>
      {children}
      <Footer />
    </>
  );
}
Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node), // Array of React nodes
    PropTypes.node, // A single React node
  ]),
  page: PropTypes.string
};

export default Layout;
