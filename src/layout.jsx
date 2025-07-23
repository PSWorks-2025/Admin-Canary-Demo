import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import { readData } from "./service/readFirebase.jsx";

export const ColorContext = createContext();

function Layout({ children, page, primaryBackgroundColor, setPrimaryBackgroundColor, secondaryBackgroundColor, setSecondaryBackgroundColor, tertiaryBackgroundColor, setTertiaryBackgroundColor, globalData, setGlobalData }) {

  const colorContextValue = {
    primaryBackgroundColor,
    secondaryBackgroundColor,
    tertiaryBackgroundColor,
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <ColorContext.Provider value={colorContextValue}>
      <Header
        page={page}
        primaryBackgroundColor={primaryBackgroundColor}
        setPrimaryBackgroundColor={setPrimaryBackgroundColor}
        secondaryBackgroundColor={secondaryBackgroundColor}
        setSecondaryBackgroundColor={setSecondaryBackgroundColor}
        tertiaryBackgroundColor={tertiaryBackgroundColor}
        setTertiaryBackgroundColor={setTertiaryBackgroundColor}
        globalData={globalData}
        setGlobalData={setGlobalData}
      />
      {children}
      <Footer
        tertiaryBackgroundColor={tertiaryBackgroundColor}
        globalData={globalData}
        setGlobalData={setGlobalData}
      />
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