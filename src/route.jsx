import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter } from 'react-router';

import './global.css';

import Layout from './layout.jsx';

import HomePage from './app/page.jsx';
import AboutPage from './app/about/page.jsx';

import EachStoryPage from './app/EachStoryPage.jsx';
import FundraisingPage from './app/FundraisingPage.jsx';

import { mockData, mockStory } from './MockData/page56MockData.js';

import Events from './app/events/page.jsx';
import Story from './app/stories/page.jsx';

const root = document.getElementById('root');
createRoot(root).render(
  <HashRouter>
    <Routes>
      <Route
        path="/"
        element={
          <Layout page="home">
            <HomePage />
          </Layout>
        }
      />

      <Route
        path="/about"
        element={
          <Layout page="about">
            <AboutPage />
          </Layout>
        }
      />
      <Route
        path="/eachStory"
        element={
          <Layout page="stories">
            <EachStoryPage
              storyName={mockStory.storyName}
              sections={mockStory.sections}
              images={mockStory.images}
            />
          </Layout>
        }
      />
    
      <Route
        path="/events"
        element={
          <Layout page="events">
            <Events />
          </Layout>
        }
      />
      <Route
        path="/stories"
        element={
          <Layout page="stories">
            <Story />
          </Layout>
        }
      />

      <Route
      path='/donate'
      element={
        <Layout page={"donate"}>
          <FundraisingPage campaignTitle={mockData.campaignTitle} campaignDescription={mockData.campaignDescription} imageUrl={mockData.imageUrl} fundraiserName={mockData.fundraiserName} amountRaised={mockData.amountRaised} goalAmount={mockData.goalAmount} qrCodeUrl={mockData.qrCodeUrl} donors={mockData.donors} totalCollected={mockData.totalCollected} totalSpent={mockData.totalSpent} transactions={mockData.transactions}  />
        </Layout>
      }/>
    </Routes>
  </HashRouter>
);
