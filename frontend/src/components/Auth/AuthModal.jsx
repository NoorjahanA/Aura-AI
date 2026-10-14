import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const AuthModal = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    login,
    register,
    loading,
    error,
    setError
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    resetFields();
    setIsAuthModalOpen(false);
  };

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
          backgroundColor: 'var(--surface-raised)'
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
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              margin: '0 auto 14px',
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
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
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
            marginBottom: '24px'
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
              marginTop: '10px',
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
