import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import { readData } from "./service/readFirebase.jsx";

export const ColorContext = createContext();

function Layout({ children, page }) {
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState("#ffffff");
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState("#ffffff");
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState("#4160df");
  const [globalData, setGlobalData] = useState({});
  const [mainData, setMainData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleGetData = async () => {
      try {
        const res = await readData();
        if (res?.global) {
          setGlobalData(res.global);
          setPrimaryBackgroundColor(res.global.primaryBackgroundColor || "#ffffff");
          setSecondaryBackgroundColor(res.global.secondaryBackgroundColor || "#ffffff");
          setTertiaryBackgroundColor(res.global.tertiaryBackgroundColor || "#4160df");
        }
        if (res?.main) {
          setMainData(res.main);
          console.log("Layout mainData:", res.main); // Debug
        }
      } catch (error) {
        console.error("Error in Layout useEffect:", error);
      } finally {
        setLoading(false);
      }
    };

    handleGetData();
  }, []);

  const colorContextValue = {
    primaryBackgroundColor,
    setPrimaryBackgroundColor,
    secondaryBackgroundColor,
    setSecondaryBackgroundColor,
    tertiaryBackgroundColor,
    setTertiaryBackgroundColor,
    mainData,
    setMainData,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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