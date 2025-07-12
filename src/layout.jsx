import PropTypes from "prop-types";
import { createContext, useState } from "react";

import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";

export const ColorContext = createContext();

function Layout({ children, page }) {
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState("#ffffff"); // Default background siêu nhân trắng
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState("#ffffff"); // Default cho header với button siêu nhân trắng luôn :)) 
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState("#4160df"); // Default cho footer siêu nhân xanh

  const colorContextValue = {
    primaryBackgroundColor,
    setPrimaryBackgroundColor,
    secondaryBackgroundColor,
    setSecondaryBackgroundColor,
    tertiaryBackgroundColor,
    setTertiaryBackgroundColor,
  };

  return (
    <ColorContext.Provider value={colorContextValue}>
      <Header page={page} primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} />
      {children}
      <Footer tertiaryBackgroundColor={tertiaryBackgroundColor} />
    </ColorContext.Provider>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node), 
    PropTypes.node,
  ]),
  page: PropTypes.string,
};

export default Layout;