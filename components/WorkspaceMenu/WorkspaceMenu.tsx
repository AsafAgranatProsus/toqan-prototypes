import React from 'react';
import { useWorkspaces } from '../../context/WorkspaceContext';
import { Icons } from '../Icons/Icons';
import Button from '../Button/Button';
import './WorkspaceMenu.css';

interface WorkspaceMenuProps {
  onClose?: () => void;
}

export const WorkspaceMenu: React.FC<WorkspaceMenuProps> = ({ onClose }) => {
  const { workspaces, activeWorkspace, setActiveWorkspace, createWorkspace } = useWorkspaces();

  const handleWorkspaceSelect = (workspaceId: string) => {
    setActiveWorkspace(workspaceId);
    onClose?.();
  };

  const handleNewWorkspace = () => {
    const name = prompt('Enter workspace name:');
    if (name?.trim()) {
      const newWorkspace = createWorkspace(name.trim());
      setActiveWorkspace(newWorkspace.id);
      onClose?.();
    }
  };

  return (
    <div className="workspace-menu">
      {/* Header */}
      <div className="workspace-menu__header">
        <span className="workspace-menu__title">Workspaces</span>
      </div>

      {/* Workspaces List */}
      <div className="workspace-menu__workspaces">
        {workspaces.map((workspace) => {
          const isActive = workspace.id === activeWorkspace?.id;
          return (
            <button
              key={workspace.id}
              className={`workspace-menu__workspace-item ${isActive ? 'workspace-menu__workspace-item--active' : ''}`}
              onClick={() => handleWorkspaceSelect(workspace.id)}
            >
              <div className="workspace-menu__workspace-info">
                <span className="workspace-menu__workspace-name">{workspace.name}</span>
                {isActive && (
                  <Icons name="Check" className="workspace-menu__check-icon" />
                )}
              </div>
            </button>
          );
        })}

        {/* New Workspace Button */}
        <div className="workspace-menu__new-workspace-container">
          <Button
            variant="text"
            size="sm"
            icon="Plus"
            onClick={handleNewWorkspace}
            className="workspace-menu__new-workspace-button"
          >
            New workspace
          </Button>
        </div>
      </div>

      {/* Divider */}
      {/* <div className="workspace-menu__divider" /> */}

      {/* Footer Actions */}
      <div className="workspace-menu__footer">
        <button className="workspace-menu__footer-item">
          <Icons name="Settings" />
          <span>Settings</span>
        </button>
        <button className="workspace-menu__footer-item">
          <Icons name="User" />
          <span>Account</span>
        </button>
      </div>
    </div>
  );
};

