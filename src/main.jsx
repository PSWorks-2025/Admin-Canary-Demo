import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter, createBrowserRouter } from 'react-router';

import { useState,useEffect } from 'react';

import './global.css';

import Layout from './layout.jsx';

import HomePage from './app/page.jsx';
import AboutPage from './app/about/page.jsx';

import EachStoryPage from './app/EachStoryPage.jsx';
import FundraisingPage from './app/FundraisingPage.jsx';

import LoadingScreen from './components/screens/LoadingScreen.jsx';

import { mockData, mockStory } from './MockData/page56MockData.js';

import Events from './app/events/page.jsx';
import Story from './app/stories/page.jsx';

import { readData } from './service/readFirebase.jsx';

export default function App(){
    const [mainData, setMainData] = useState({});
      const [primaryBackgroundColor, setPrimaryBackgroundColor] = useState();
      const [secondaryBackgroundColor, setSecondaryBackgroundColor] = useState();
      const [tertiaryBackgroundColor, setTertiaryBackgroundColor] = useState();
      const [globalData, setGlobalData] = useState({});
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
              console.log("Layout mainData:", res.main); 
            }
          } catch (error) {
            console.error("Error in Layout useEffect:", error);
          } finally {
            setLoading(false);
          }
        };
    
        handleGetData();
      }, []);

    if (loading) {
      return <LoadingScreen />;
    }
    
    return(
        <HashRouter>
            <Routes>
            <Route
                path="/"
                element={
                <Layout page="" primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} globalData={globalData} setGlobalData={setGlobalData}>
                    <HomePage mainData={mainData} setMainData={setMainData} />
                </Layout>
                }
            />
    
            <Route
                path="/about"
                element={
                <Layout page="about" primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} globalData={globalData} setGlobalData={setGlobalData}>
                    <AboutPage mainData={mainData} setMainData={setMainData} />
                </Layout>
                }
            />
            <Route
                path="/eachStory"
                element={
                <Layout page="stories" primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} globalData={globalData} setGlobalData={setGlobalData}>
                    <EachStoryPage
                    mainData={mainData} setMainData={setMainData}
                    />
                </Layout>
                }
            />
    
            <Route
                path="/events"
                element={
                <Layout page="events" primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} globalData={globalData} setGlobalData={setGlobalData}>
                    <Events mainData={mainData} setMainData={setMainData} />
                </Layout>
                }
            />
    
            <Route
                path="/donate"
                element={
                <Layout page="donate" primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} globalData={globalData} setGlobalData={setGlobalData}>
                    <FundraisingPage mainData={mainData} setMainData={setMainData} />
                </Layout>
                }
            />
    
            <Route
                path="/stories"
                element={
                <Layout page="stories" primaryBackgroundColor={primaryBackgroundColor} setPrimaryBackgroundColor={setPrimaryBackgroundColor} secondaryBackgroundColor={secondaryBackgroundColor} setSecondaryBackgroundColor={setSecondaryBackgroundColor} tertiaryBackgroundColor={tertiaryBackgroundColor} setTertiaryBackgroundColor={setTertiaryBackgroundColor} globalData={globalData} setGlobalData={setGlobalData}>
                    <Story mainData={mainData} setMainData={setMainData} />
                </Layout>
                }
            />
            </Routes>
        </HashRouter>
    )
}