import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import FeatureMenu from './components/FeatureMenu/FeatureMenu';
import ThemeDebugger from './components/ThemeDebugger/ThemeDebugger';
import { useFeatureFlags } from './context/FeatureFlagContext';

const App: React.FC = () => {
  const { flags } = useFeatureFlags();

  return (
    <BrowserRouter>
      <FeatureMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system/*" element={<DesignSystemPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {flags.showThemeDebugger && <ThemeDebugger />}
    </BrowserRouter>
  );
};

export default App;