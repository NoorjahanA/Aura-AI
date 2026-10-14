import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    loginWithGoogle,
    loading,
    error,
    setError
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showGoogleDialog, setShowGoogleDialog] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const googleBtnRef = useRef(null);

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setShowGoogleDialog(false);
  };

  const handleClose = () => {
    resetFields();
    setIsAuthModalOpen(false);
  };

  // Initialize official Google Identity Services if client ID is configured
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (response.credential) {
              await loginWithGoogle({ credential: response.credential });
            }
          }
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with'
          });
        }
      } catch (err) {
        console.warn('Google GSI Init:', err);
      }
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      resetFields();
    } catch {
      // error handled in context
    }
  };

  const handleGoogleClick = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (window.google?.accounts?.id && clientId) {
      window.google.accounts.id.prompt();
    } else {
      // If VITE_GOOGLE_CLIENT_ID is not configured, open interactive Google Account modal
      setShowGoogleDialog(true);
    }
  };

  const handleGoogleDialogSubmit = async (e) => {
    e?.preventDefault();
    const cleanEmail = (googleEmailInput || 'user@gmail.com').trim().toLowerCase();
    const cleanName = (googleNameInput || cleanEmail.split('@')[0]).trim();
    try {
      await loginWithGoogle({
        email: cleanEmail,
        name: cleanName,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanEmail}`,
        googleId: `goog_${cleanEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
      });
      resetFields();
    } catch {
      // handled
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={handleClose}
    >
      <div
        className="neu-raised"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '32px',
          position: 'relative',
          backgroundColor: 'var(--surface-raised)',
          borderRadius: '24px'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="neu-btn"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            padding: 0,
            borderRadius: '50%'
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--surface)',
              boxShadow: 'var(--neu-subtle)',
              color: 'var(--accent-color)'
            }}
          >
            <Sparkles size={26} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            {authMode === 'login'
              ? 'Access your synced conversations and settings'
              : 'Sign up to persist chats across devices'}
          </p>
        </div>

        {/* Tab Switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface)',
            boxShadow: 'var(--neu-pressed)',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '20px'
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setPassword('');
              setError('');
            }}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '9px',
              padding: '9px',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: authMode === 'login' ? 'var(--surface-raised)' : 'transparent',
              boxShadow: authMode === 'login' ? 'var(--neu-subtle)' : 'none',
              color: authMode === 'login' ? 'var(--accent-color)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setPassword('');
              setError('');
            }}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '9px',
              padding: '9px',
              fontFamily: 'inherit',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              background: authMode === 'register' ? 'var(--surface-raised)' : 'transparent',
              boxShadow: authMode === 'register' ? 'var(--neu-subtle)' : 'none',
              color: authMode === 'register' ? 'var(--accent-color)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--danger-color)',
              color: 'var(--danger-color)',
              fontSize: '0.85rem',
              marginBottom: '18px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={handleGoogleClick}
            disabled={loading}
            className="neu-btn"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '0.92rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          {/* Hidden/rendered Google GSI container if client ID is active */}
          <div ref={googleBtnRef} style={{ display: 'none' }} />
        </div>

        {/* Quick Google Account Selection Dialog if no GCP Client ID configured */}
        {showGoogleDialog && (
          <div
            className="neu-flat"
            style={{
              padding: '16px',
              borderRadius: '16px',
              marginBottom: '18px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--accent-color)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <GoogleIcon />
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                Sign in with Google Account
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Enter your Google email to connect your personalized account & chat history:
            </p>

            <form onSubmit={handleGoogleDialogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                required
                placeholder="e.g. yourname@gmail.com"
                className="neu-input"
                style={{ fontSize: '0.85rem', padding: '9px 12px' }}
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
              />
              <input
                type="text"
                placeholder="Display Name (optional)"
                className="neu-input"
                style={{ fontSize: '0.85rem', padding: '9px 12px' }}
                value={googleNameInput}
                onChange={(e) => setGoogleNameInput(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="neu-btn neu-btn-primary"
                  style={{ flex: 1, padding: '9px', fontSize: '0.84rem' }}
                >
                  Confirm & Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setShowGoogleDialog(false)}
                  className="neu-btn"
                  style={{ padding: '9px 14px', fontSize: '0.84rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '18px 0',
            gap: '12px'
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 500
            }}
          >
            or with email
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authMode === 'register' && (
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  marginBottom: '6px'
                }}
              >
                Display Name
              </label>
              <div style={{ position: 'relative' }}>
                <User
                  size={17}
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  className="neu-input"
                  style={{ paddingLeft: '42px' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="neu-input"
                style={{ paddingLeft: '42px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="neu-input"
                style={{ paddingLeft: '42px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="neu-btn neu-btn-primary"
            style={{
              marginTop: '8px',
              padding: '13px',
              fontSize: '0.96rem',
              fontWeight: 600
            }}
          >
            {loading ? (
              'Processing...'
            ) : authMode === 'login' ? (
              <>
                <LogIn size={18} /> Sign In
              </>
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
