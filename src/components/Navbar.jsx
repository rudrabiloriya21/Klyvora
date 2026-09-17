import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';
import { useAuth } from '../context/useAuth';
import UserMenuDropdown from './auth/UserMenuDropdown';

export default function Navbar({ onLaunchStudio }) {
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Check current visible section
      const sections = ['home', 'about', 'features', 'showcase', 'xeorvia', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Showcase', href: '#showcase', id: 'showcase' },
    { label: 'Xeorvia', href: '#xeorvia', id: 'xeorvia' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  const handleLinkClick = (href) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`navbar-root ${scrolled ? 'navbar-scrolled' : ''}`}
      role="banner"
    >
      <div className="container nav-container">
        {/* Brand Identity */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('#home');
          }}
          className="nav-brand-link"
          aria-label="Klyvora Home"
        >
          <BrandLogo size="default" />
        </a>

        {/* Desktop Navigation */}
        <nav className="nav-desktop" aria-label="Main Navigation">
          <ul className="nav-list">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <li key={link.id} className="nav-item">
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {link.label}
                    {isActive && <span className="nav-active-pill" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="nav-actions">
          {currentUser ? (
            <UserMenuDropdown onNavigate={(h) => window.location.hash = h} />
          ) : (
            <a
              href="#/login"
              className="nav-signin-link font-mono"
            >
              Sign In
            </a>
          )}

          <button
            onClick={() => {
              if (onLaunchStudio) onLaunchStudio();
              else window.location.hash = currentUser ? '#/dashboard' : '#/login';
            }}
            className="btn btn-primary nav-cta"
            aria-label="Launch Klyvora Studio"
          >
            <span>{currentUser ? 'Studio Dashboard' : 'Launch Studio'}</span>
            <Sparkles size={16} />
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Navigation Menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? 'mobile-drawer-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-drawer-content">
          <ul className="mobile-nav-list">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }}
                  className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={18} className="mobile-link-icon" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mobile-drawer-cta">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onLaunchStudio) onLaunchStudio();
                else window.location.hash = currentUser ? '#/dashboard' : '#/login';
              }}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <span>{currentUser ? 'Studio Dashboard' : 'Launch Studio'}</span>
              <Sparkles size={16} />
            </button>
            {!currentUser && (
              <a
                href="#/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary font-mono"
                style={{ width: '100%', marginTop: '8px', textAlign: 'center' }}
              >
                Sign In to Account
              </a>
            )}
            <p className="mobile-drawer-subtext">AI website creation OS by Xeorvia</p>
          </div>
        </div>
      </div>
    </header>
  );
}
