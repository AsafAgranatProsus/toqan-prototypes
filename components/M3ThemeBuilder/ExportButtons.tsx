import React, { useState } from 'react';
import { M3Theme, exportThemeAsCSS, exportThemeAsJSON } from '../../themes/m3';
import './ExportButtons.css';

export interface ExportButtonsProps {
  theme: M3Theme;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ theme }) => {
  const [copied, setCopied] = useState<'css' | 'json' | null>(null);
  
  const handleExportCSS = async () => {
    const css = exportThemeAsCSS(theme);
    await navigator.clipboard.writeText(css);
    setCopied('css');
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleExportJSON = async () => {
    const json = exportThemeAsJSON(theme);
    await navigator.clipboard.writeText(json);
    setCopied('json');
    setTimeout(() => setCopied(null), 2000);
  };
  
  const handleDownloadCSS = () => {
    const css = exportThemeAsCSS(theme);
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'm3-theme.css';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadJSON = () => {
    const json = exportThemeAsJSON(theme);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'm3-theme.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="export-buttons">
      <div className="export-row">
        <button className="export-btn" onClick={handleExportCSS}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          {copied === 'css' ? 'Copied!' : 'Copy CSS'}
        </button>
        <button className="export-btn secondary" onClick={handleDownloadCSS}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download
        </button>
      </div>
      
      <div className="export-row">
        <button className="export-btn" onClick={handleExportJSON}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
          {copied === 'json' ? 'Copied!' : 'Copy JSON'}
        </button>
        <button className="export-btn secondary" onClick={handleDownloadJSON}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
          Download
        </button>
      </div>
    </div>
  );
};

