import React from 'react';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Klyvora ErrorBoundary] Caught component runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.hash = '#/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen font-sans">
          <div className="ambient-lighting" aria-hidden="true">
            <div className="ambient-orb ambient-orb-1" />
            <div className="ambient-orb ambient-orb-2" />
          </div>

          <div className="error-boundary-card">
            <div className="error-boundary-icon-wrap">
              <AlertTriangle className="error-boundary-icon" size={32} />
            </div>

            <span className="error-boundary-badge font-mono">SYSTEM RECOVERY ACTIVATED</span>
            <h1 className="error-boundary-title">Digital Experience Encountered An Issue</h1>
            <p className="error-boundary-desc">
              Klyvora prevented an unexpected interruption. Your project data is safely stored in local state.
            </p>

            {this.state.error && (
              <div className="error-boundary-debug font-mono">
                <div className="error-debug-header">
                  <Terminal size={14} />
                  <span>EXCEPTION LOG</span>
                </div>
                <div className="error-debug-message">
                  {this.state.error.toString()}
                </div>
              </div>
            )}

            <div className="error-boundary-actions">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary-action font-mono"
              >
                <RefreshCw size={15} />
                <span>Reload Experience</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-secondary-action font-mono"
              >
                <Home size={15} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
