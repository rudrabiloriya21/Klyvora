import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const {
    currentUser,
    updateUserProfile,
    changePassword,
    resendVerification,
    deleteUserAccount,
    logOut,
  } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'danger'
  const [displayName, setDisplayName] = useState(() => currentUser?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Deletion state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Verification resend state
  const [sendingVerification, setSendingVerification] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState('');

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  // Handle display name update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!displayName.trim()) {
      setProfileError('Display name cannot be empty.');
      return;
    }

    setSavingProfile(true);
    try {
      await updateUserProfile(displayName.trim());
      setProfileSuccess('Profile display name updated successfully.');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle verification resend
  const handleResendVerification = async () => {
    setSendingVerification(true);
    setVerificationFeedback('');
    try {
      await resendVerification();
      setVerificationFeedback('Verification email sent! Please check your inbox.');
    } catch (err) {
      setVerificationFeedback(err.message || 'Failed to transmit verification email.');
    } finally {
      setSendingVerification(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (deleteConfirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm account deletion.');
      return;
    }
    if (!deletePassword) {
      setDeleteError('Please enter your current password to authorize account removal.');
      return;
    }

    setDeleting(true);
    try {
      await deleteUserAccount(deletePassword);
      onClose();
      window.location.hash = '#/';
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account. Please verify your password.');
      setDeleting(false);
    }
  };

  const handleLogout = async () => {
    onClose();
    await logOut();
    window.location.hash = '#/login';
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="modal-content modal-content-wide glass-card glass-card-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <User size={20} className="text-cyan" />
            <h2 className="modal-title font-display">Account & Security Settings</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="account-modal-tabs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`account-tab-btn font-mono ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={15} />
            <span>Profile Identity</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`account-tab-btn font-mono ${activeTab === 'security' ? 'active' : ''}`}
          >
            <KeyRound size={15} />
            <span>Security & Password</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('danger')}
            className={`account-tab-btn font-mono tab-danger ${activeTab === 'danger' ? 'active' : ''}`}
          >
            <Trash2 size={15} />
            <span>Danger Zone</span>
          </button>
        </div>

        <div className="modal-body account-modal-body">
          {/* TAB 1: Profile Identity */}
          {activeTab === 'profile' && (
            <div className="account-tab-content">
              {/* Profile Card Header */}
              <div className="account-summary-card glass-card">
                <div className="account-avatar-large font-display">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
                <div className="account-summary-info">
                  <h3 className="account-name font-display">
                    {currentUser.displayName || 'Klyvora Architect'}
                  </h3>
                  <span className="account-email font-mono">{currentUser.email}</span>
                  <div className="account-badges-row">
                    {currentUser.emailVerified ? (
                      <span className="status-badge badge-verified font-mono">
                        <CheckCircle2 size={12} /> Verified Email
                      </span>
                    ) : (
                      <div className="unverified-pill-wrap">
                        <span className="status-badge badge-unverified font-mono">
                          <AlertTriangle size={12} /> Unverified
                        </span>
                        <button
                          type="button"
                          onClick={handleResendVerification}
                          disabled={sendingVerification}
                          className="verify-resend-inline font-mono"
                        >
                          {sendingVerification ? 'Sending...' : 'Send link'}
                        </button>
                      </div>
                    )}
                    <span className="uid-chip font-mono" title={`UID: ${currentUser.uid}`}>
                      UID: {currentUser.uid.slice(0, 8)}...
                    </span>
                  </div>
                  {verificationFeedback && (
                    <span className="verification-feedback font-mono">{verificationFeedback}</span>
                  )}
                </div>
              </div>

              {/* Edit Display Name Form */}
              <form onSubmit={handleUpdateProfile} className="account-edit-form">
                <h4 className="section-subtitle font-display">Update Personal Information</h4>

                {profileSuccess && (
                  <div className="auth-alert-banner alert-success font-mono">
                    <CheckCircle2 size={15} />
                    <span>{profileSuccess}</span>
                  </div>
                )}
                {profileError && (
                  <div className="auth-alert-banner alert-error font-mono">
                    <AlertTriangle size={15} />
                    <span>{profileError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="acc-display-name" className="form-label font-mono">
                    FULL NAME
                  </label>
                  <div className="input-with-icon">
                    <User size={16} className="input-icon text-muted" />
                    <input
                      id="acc-display-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your full name"
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label font-mono">PRIMARY EMAIL ADDRESS</label>
                  <div className="input-with-icon">
                    <Mail size={16} className="input-icon text-muted" />
                    <input
                      type="email"
                      value={currentUser.email || ''}
                      disabled
                      className="auth-input disabled-input"
                    />
                  </div>
                  <span className="field-hint font-mono">
                    Email cannot be changed directly in this prototype.
                  </span>
                </div>

                <div className="modal-actions-row">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-primary font-mono"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-secondary font-mono"
                  >
                    <LogOut size={14} />
                    <span>Log Out</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="account-tab-content">
              <form onSubmit={handleChangePassword} className="account-edit-form">
                <h4 className="section-subtitle font-display">Change Account Password</h4>

                {passwordSuccess && (
                  <div className="auth-alert-banner alert-success font-mono">
                    <CheckCircle2 size={15} />
                    <span>{passwordSuccess}</span>
                  </div>
                )}
                {passwordError && (
                  <div className="auth-alert-banner alert-error font-mono">
                    <AlertTriangle size={15} />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="curr-pwd" className="form-label font-mono">
                    CURRENT PASSWORD
                  </label>
                  <div className="input-with-icon">
                    <KeyRound size={16} className="input-icon text-muted" />
                    <input
                      id="curr-pwd"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="auth-input auth-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="password-toggle-btn"
                    >
                      {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="new-pwd" className="form-label font-mono">
                    NEW PASSWORD
                  </label>
                  <div className="input-with-icon">
                    <KeyRound size={16} className="input-icon text-muted" />
                    <input
                      id="new-pwd"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="auth-input auth-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="password-toggle-btn"
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-new-pwd" className="form-label font-mono">
                    CONFIRM NEW PASSWORD
                  </label>
                  <div className="input-with-icon">
                    <KeyRound size={16} className="input-icon text-muted" />
                    <input
                      id="confirm-new-pwd"
                      type={showNewPassword ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      className="auth-input auth-password-input"
                    />
                  </div>
                </div>

                <div className="modal-actions-row">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn btn-primary font-mono"
                  >
                    {savingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Danger Zone */}
          {activeTab === 'danger' && (
            <div className="account-tab-content">
              <div className="danger-zone-box glass-card">
                <div className="danger-zone-header">
                  <AlertTriangle size={22} className="text-rose" />
                  <div>
                    <h4 className="danger-zone-title font-display">Permanent Account Deletion</h4>
                    <p className="danger-zone-desc">
                      Deleting your account will permanently eradicate your user profile, active
                      project sessions, and cloud configurations. This operation is non-reversible.
                    </p>
                  </div>
                </div>

                {deleteError && (
                  <div className="auth-alert-banner alert-error font-mono">
                    <AlertTriangle size={15} />
                    <span>{deleteError}</span>
                  </div>
                )}

                <form onSubmit={handleDeleteAccount} className="danger-zone-form">
                  <div className="form-group">
                    <label htmlFor="delete-confirm" className="form-label font-mono text-rose">
                      TYPE "DELETE" TO CONFIRM
                    </label>
                    <input
                      id="delete-confirm"
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                      className="auth-input danger-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="delete-pwd" className="form-label font-mono">
                      YOUR CURRENT PASSWORD
                    </label>
                    <div className="input-with-icon">
                      <KeyRound size={16} className="input-icon text-muted" />
                      <input
                        id="delete-pwd"
                        type={showDeletePassword ? 'text' : 'password'}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="auth-input auth-password-input danger-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePassword(!showDeletePassword)}
                        className="password-toggle-btn"
                      >
                        {showDeletePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={deleting || deleteConfirmText !== 'DELETE'}
                    className="btn btn-danger font-mono"
                  >
                    <Trash2 size={16} />
                    <span>{deleting ? 'Deleting Account...' : 'Permanently Delete Account'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
