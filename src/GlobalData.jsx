// GlobalContext.jsx
import { createContext, useState, useEffect } from "react";
import { readData } from "./service/readFirebase.jsx";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState();
  const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState();
  const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState();
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
        }
      } catch (error) {
        console.error("Error in GlobalProvider useEffect:", error);
      } finally {
        setLoading(false);
      }
    };

    handleGetData();
  }, []);

  const contextValue = {
    loading,
    globalData,
    setGlobalData,
    mainData,
    setMainData,
    primaryBackgroundColor,
    setPrimaryBackgroundColor,
    secondaryBackgroundColor,
    setSecondaryBackgroundColor,
    tertiaryBackgroundColor,
    setTertiaryBackgroundColor,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
