import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Features from './components/Features';
import Showcase from './components/Showcase';
import XeorviaStory from './components/XeorviaStory';
import FinalCTA from './components/FinalCTA';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import XeorviaModal from './components/XeorviaModal';

// Klyvora Studio Modules
import DashboardView from './components/studio/DashboardView';
import NewProjectWizard from './components/studio/NewProjectWizard';
import WorkspaceLayout from './components/studio/WorkspaceLayout';
import { storageService } from './services/storageService';

import AuthProvider from './context/AuthContext';
import { useAuth } from './context/useAuth';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';
import EmailVerificationPage from './components/auth/EmailVerificationPage';

function AppRouter() {
  const { currentUser, loading } = useAuth();

  // Initialize storage seeds if first visit
  useEffect(() => {
    storageService.initStorage();
  }, []);

  // Hash Routing State
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/');
  const [redirectTarget, setRedirectTarget] = useState(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((hash) => {
    window.location.hash = hash;
  }, []);

  // Marketing page state
  const [legalModal, setLegalModal] = useState({ isOpen: false, type: 'privacy' });
  const [xeorviaModalOpen, setXeorviaModalOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading Screen while Firebase restores persistent session
  if (loading) {
    return (
      <div className="auth-loading-screen font-mono">
        <div className="auth-loading-spinner" />
        <span className="auth-loading-text">INITIALIZING KLYVORA SECURITY ARCHITECTURE...</span>
      </div>
    );
  }

  // 1. PUBLIC AUTH ROUTE: Login
  if (currentHash.startsWith('#/login')) {
    if (currentUser) {
      navigate(redirectTarget || '#/dashboard');
      return null;
    }
    return <LoginPage onNavigate={navigate} redirectPath={redirectTarget} />;
  }

  // 2. PUBLIC AUTH ROUTE: Sign Up
  if (currentHash.startsWith('#/signup')) {
    if (currentUser) {
      navigate('#/dashboard');
      return null;
    }
    return <SignUpPage onNavigate={navigate} />;
  }

  // 3. PUBLIC AUTH ROUTE: Forgot Password
  if (currentHash.startsWith('#/forgot-password')) {
    return <ForgotPasswordPage onNavigate={navigate} />;
  }

  // 4. AUTH ROUTE: Email Verification
  if (currentHash.startsWith('#/verify-email')) {
    return <EmailVerificationPage onNavigate={navigate} />;
  }

  // -------------------------------------------------------------
  // PROTECTED ROUTES (Require Authenticated User)
  // -------------------------------------------------------------
  const isProtectedRoute =
    currentHash === '#/dashboard' ||
    currentHash === '#/new' ||
    currentHash === '#/account' ||
    currentHash.startsWith('#/workspace/');

  if (isProtectedRoute && !currentUser) {
    if (redirectTarget !== currentHash) {
      setRedirectTarget(currentHash);
    }
    return <LoginPage onNavigate={navigate} redirectPath={currentHash} />;
  }

  // 5. PROTECTED ROUTE: New Project Wizard
  if (currentHash === '#/new') {
    return (
      <NewProjectWizard
        onProjectCreated={(projectId) => navigate(`#/workspace/${projectId}`)}
        onCancel={() => navigate('#/dashboard')}
      />
    );
  }

  // 6. PROTECTED ROUTE: Workspace Editor
  if (currentHash.startsWith('#/workspace/')) {
    const rawPath = currentHash.replace('#/workspace/', '').split('?')[0];
    const pathParts = rawPath.split('/').filter(Boolean);
    const projectId = pathParts[0];
    const pageSlug = pathParts[1] || 'home';

    // Track active project ID for workspace session safety
    if (projectId) {
      try {
        sessionStorage.setItem('klyvora_last_active_project', projectId);
      } catch {
        // ignore storage errors
      }
    }

    return (
      <WorkspaceLayout
        projectId={projectId}
        initialPageSlug={pageSlug}
        onBackToDashboard={() => navigate('#/dashboard')}
      />
    );
  }

  // Session safety: Prevent accidental section hashes from dropping to marketing page
  if (
    currentHash.startsWith('#about') ||
    currentHash.startsWith('#contact') ||
    currentHash.startsWith('#products') ||
    currentHash.startsWith('#menu') ||
    currentHash.startsWith('#reviews') ||
    currentHash.startsWith('#testimonials') ||
    currentHash.startsWith('#home') ||
    currentHash.startsWith('#pricing') ||
    currentHash.startsWith('#faq')
  ) {
    const activeProjectId = sessionStorage.getItem('klyvora_last_active_project');
    if (activeProjectId) {
      const cleanSlug = currentHash.replace(/^#/, '').split('?')[0];
      navigate(`#/workspace/${activeProjectId}/${cleanSlug}`);
      return null;
    }
  }

  // 7. PROTECTED ROUTE: Studio Dashboard
  if (currentHash === '#/dashboard' || currentHash === '#/account') {
    return (
      <DashboardView
        onOpenProject={(id) => navigate(`#/workspace/${id}`)}
        onCreateNewProject={() => navigate('#/new')}
        onOpenMarketingPage={() => navigate('#/')}
      />
    );
  }

  // 8. PUBLIC ROUTE: Marketing Landing Page (Default: '#/' or '#/welcome')
  return (
    <div className="page-wrapper">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-lighting" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Navigation with Auth-aware triggers */}
      <Navbar onLaunchStudio={() => navigate(currentUser ? '#/dashboard' : '#/login')} />

      {/* Main Marketing Sections */}
      <main id="main-content">
        <Hero
          onExploreClick={() => scrollToSection('features')}
          onDiscoverXeorviaClick={() => scrollToSection('xeorvia')}
          onStartBuilding={() => navigate(currentUser ? '#/dashboard' : '#/login')}
        />

        <About />

        <Features />

        <Showcase />

        <XeorviaStory onOpenXeorviaModal={() => setXeorviaModalOpen(true)} />

        {/* Final CTA launches studio */}
        <FinalCTA
          onEnterExperience={() => {
            navigate(currentUser ? '#/dashboard' : '#/login');
          }}
        />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setLegalModal({ isOpen: true, type: 'privacy' })}
        onOpenTerms={() => setLegalModal({ isOpen: true, type: 'terms' })}
        onOpenXeorvia={() => setXeorviaModalOpen(true)}
      />

      {/* Modals */}
      <LegalModal
        isOpen={legalModal.isOpen}
        type={legalModal.type}
        onClose={() => setLegalModal({ isOpen: false, type: 'privacy' })}
      />

      <XeorviaModal
        isOpen={xeorviaModalOpen}
        onClose={() => setXeorviaModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
