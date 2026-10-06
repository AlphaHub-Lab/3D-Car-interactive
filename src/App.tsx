import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ModelsPage } from './pages/ModelsPage';
import { ModelViewerPage } from './pages/ModelViewerPage';
import { TechnologyPage } from './pages/TechnologyPage';
import { ExplorePage } from './pages/ExplorePage';
import { PerformancePage } from './pages/PerformancePage';
import { AboutPage } from './pages/AboutPage';
import { ExchangePage } from './pages/ExchangePage';
import { TelemetryPage } from './pages/TelemetryPage';
import { AuthPage } from './pages/AuthPage';

// Helper component to scroll window to top upon route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-bg-primary text-text-primary">
        <ScrollToTop />
        {/* Universal Mercedes-AMG Navbar */}
        <Navbar />

        {/* Dynamic Route Viewports */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:modelId" element={<ModelViewerPage />} />
          <Route path="/technology" element={<TechnologyPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/telemetry" element={<TelemetryPage />} />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
