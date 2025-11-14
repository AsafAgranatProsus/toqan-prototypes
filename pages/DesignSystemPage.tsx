import React from 'react';
import { Outlet } from 'react-router-dom';
import DesignSystemDemo from '../components/DesignSystemDemo/DesignSystemDemo';
import './DesignSystemPage.css';

export const DesignSystemPage: React.FC = () => {
  return (
    <div className="design-system-page d-contents">
      <DesignSystemDemo />
      <Outlet />
    </div>
  );
};

