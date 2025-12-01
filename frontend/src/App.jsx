import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ResumeAnalyze from './pages/ResumeAnalyze.jsx';
import NotFound from './pages/NotFound.jsx';
import ErrorBoundary from './components/error-boundary/ErrorBoundary.jsx';
import { Toaster, toast } from 'sonner';
import Profile from './pages/Profile';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<ResumeAnalyze />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;