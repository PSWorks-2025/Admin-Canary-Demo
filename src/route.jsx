import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter, useLocation } from 'react-router-dom';
import './global.css';

import Layout from './layout.jsx';

import HomePage from './app/page.jsx';
import AboutPage from './app/about/page.jsx';
import EachStoryPage from './app/EachStoryPage.jsx';
import FundraisingPage from './app/FundraisingPage.jsx';
import Events from './app/events/page.jsx';
import Story from './app/stories/page.jsx';

import { mockStory } from './MockData/page56MockData';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Layout page={location.pathname}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/eachStory"
          element={<EachStoryPage {...mockStory} />} // Inject props
        />
        <Route path="/events" element={<Events />} />
        <Route path="/stories" element={<Story />} />
        <Route path="/donate" element={<FundraisingPage />} />
        <Route path="*" element={<div>404 | Page Not Found</div>} />
      </Routes>
    </Layout>
  );
};

const root = document.getElementById('root');
createRoot(root).render(
  <HashRouter>
    <AppRoutes />
  </HashRouter>
);
