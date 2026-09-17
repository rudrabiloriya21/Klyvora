import React, { useState, useRef, useEffect } from 'react';
import {
  Settings,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  FolderKanban,
  Plus,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import AccountSettingsModal from './AccountSettingsModal';

export default function UserMenuDropdown({ onNavigate }) {
  const { currentUser, logOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const initials = (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase();
  const isVerified = Boolean(currentUser.emailVerified);

  const handleLogout = async () => {
    setIsOpen(false);
    await logOut();
    if (onNavigate) onNavigate('#/login');
    else window.location.hash = '#/login';
  };

  const handleNav = (hash) => {
    setIsOpen(false);
    if (onNavigate) onNavigate(hash);
    else window.location.hash = hash;
  };

  return (
    <div className="user-menu-container" ref={dropdownRef}>
      {/* Trigger Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="user-menu-trigger font-mono"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User Account Menu"
      >
        <div className="user-avatar-circle font-display">
          {initials}
        </div>
        <span className="user-menu-name">
          {currentUser.displayName || currentUser.email.split('@')[0]}
        </span>
        <ChevronDown size={14} className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="user-dropdown-card glass-card glass-card-elevated" role="menu">
          {/* Header Info */}
          <div className="dropdown-user-header">
            <div className="dropdown-avatar-wrap">
              <div className="user-avatar-circle user-avatar-large font-display">
                {initials}
              </div>
            </div>
            <div className="dropdown-info-wrap">
              <strong className="dropdown-display-name font-display">
                {currentUser.displayName || 'Klyvora User'}
              </strong>
              <span className="dropdown-email font-mono">{currentUser.email}</span>
              <div className="dropdown-verification-row">
                {isVerified ? (
                  <span className="badge-verified-tiny font-mono">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                ) : (
                  <span className="badge-unverified-tiny font-mono">
                    <AlertTriangle size={11} /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="dropdown-divider" />

          {/* Navigation Links */}
          <div className="dropdown-items-stack">
            <button
              type="button"
              onClick={() => handleNav('#/dashboard')}
              className="dropdown-item font-mono"
              role="menuitem"
            >
              <FolderKanban size={15} className="text-cyan" />
              <span>Project Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('#/new')}
              className="dropdown-item font-mono"
              role="menuitem"
            >
              <Plus size={15} className="text-cyan" />
              <span>Create New Project</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSettingsModalOpen(true);
              }}
              className="dropdown-item font-mono"
              role="menuitem"
            >
              <Settings size={15} className="text-violet" />
              <span>Account & Security</span>
            </button>
          </div>

          <div className="dropdown-divider" />

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="dropdown-item dropdown-item-logout font-mono"
            role="menuitem"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}
