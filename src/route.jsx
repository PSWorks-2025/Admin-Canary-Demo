import { createRoot } from 'react-dom/client';
import { Routes, Route, HashRouter, useLocation } from 'react-router';
import './global.css';

import Layout from './layout.jsx';

import HomePage from './app/homes';
import AboutPage from './app/about';
import EditContent from './app/EditContent.jsx'; //change later
import FundraisingPage from './app/donates';
import Events from './app/events';
import Story from './app/stories';

import { mockStory } from './MockData/page56MockData';

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Layout page={location.pathname}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/edit-content"
          element={<EditContent />} // Inject props
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