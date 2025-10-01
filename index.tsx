import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { ThemeProvider } from './context/ThemeContext';
import { FeatureFlagProvider } from './context/FeatureFlagContext';
import { ScenarioProvider } from './context/ScenarioContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <FeatureFlagProvider>
      <ScenarioProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ScenarioProvider>
    </FeatureFlagProvider>
  </React.StrictMode>
);