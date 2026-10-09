import React from 'react';
import { Trees, LayoutDashboard, Database, BarChart3, LogIn, LogOut, User, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = ({ currentTab, setCurrentTab, onOpenAddModal }) => {
  const { user, isAuthenticated, logout, isPlanterOrAdmin } = useAuth();

  return (
    <header style={{
      background: '#064e3b',
      color: '#ffffff',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(6, 78, 59, 0.25)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.25rem',
      }}>
        {/* Logo */}
        <div 
          onClick={() => setCurrentTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
          }}>
            <Trees size={24} color="#ffffff" />
          </div>
          <div>
            <span className="brand-font" style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'block', lineHeight: 1.1 }}>
              EcoTrack
            </span>
            <span style={{ fontSize: '0.7rem', color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
              Tree Plantation Tracker
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setCurrentTab('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '8px',
              border: 'none',
              background: currentTab === 'dashboard' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: currentTab === 'dashboard' ? '#ffffff' : '#d1fae5',
              cursor: 'pointer',
              fontWeight: currentTab === 'dashboard' ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab('directory')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '8px',
              border: 'none',
              background: currentTab === 'directory' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: currentTab === 'directory' ? '#ffffff' : '#d1fae5',
              cursor: 'pointer',
              fontWeight: currentTab === 'directory' ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            <Database size={17} />
            <span>Trees Directory</span>
          </button>

          <button
            onClick={() => setCurrentTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              borderRadius: '8px',
              border: 'none',
              background: currentTab === 'analytics' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              color: currentTab === 'analytics' ? '#ffffff' : '#d1fae5',
              cursor: 'pointer',
              fontWeight: currentTab === 'analytics' ? 700 : 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s',
            }}
          >
            <BarChart3 size={17} />
            <span>Analytics</span>
          </button>
        </nav>

        {/* Action Controls & Auth State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {isPlanterOrAdmin && (
            <button
              onClick={onOpenAddModal}
              className="btn btn-primary"
              style={{
                fontSize: '0.8125rem',
                padding: '0.5rem 1rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
              }}
            >
              <PlusCircle size={16} />
              <span>Plant a Tree</span>
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '0.375rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
              }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#6ee7b7', textTransform: 'uppercase' }}>
                    {user.role}
                  </div>
                </div>
              </div>

              <button
                onClick={logout}
                title="Logout"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.45rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentTab('login')}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                fontSize: '0.8125rem',
                padding: '0.5rem 1rem',
              }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
