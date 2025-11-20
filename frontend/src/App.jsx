import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ResumeAnalyze from './pages/ResumeAnalyze.jsx';
import Profile from './pages/ProfileCard.jsx';
import ErrorBoundary from './components/error-boundary/ErrorBoundary.jsx';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<ResumeAnalyze />} />
        <Route path="/developer" element={<Profile />} />
        <Route path="*" element={<div className="text-center text-4xl mt-40">404 - Page Not Found</div>} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;