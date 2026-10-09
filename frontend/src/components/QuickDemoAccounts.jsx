import React from 'react';
import { Shield, Sparkles, UserCheck } from 'lucide-react';

export const QuickDemoAccounts = ({ onSelectAccount }) => {
  const accounts = [
    {
      role: 'admin',
      title: 'Admin Supervisor',
      email: 'admin@treetracker.org',
      password: 'admin123',
      color: '#dc2626',
      bg: '#fee2e2',
      badge: 'Full Access (Add / Edit / Delete)',
    },
    {
      role: 'planter',
      title: 'Green Planter',
      email: 'planter@treetracker.org',
      password: 'planter123',
      color: '#059669',
      bg: '#dcfce7',
      badge: 'Plant & Update Trees',
    },
    {
      role: 'volunteer',
      title: 'Aarav Patel',
      email: 'aarav@treetracker.org',
      password: 'user123',
      color: '#2563eb',
      bg: '#dbeafe',
      badge: 'Community Explorer',
    },
  ];

  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sparkles size={16} color="#059669" />
        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
          One-Click Demo Credentials (Instant Login)
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
        {accounts.map((acc) => (
          <div
            key={acc.role}
            onClick={() => onSelectAccount(acc.email, acc.password)}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = '#f0fdf4';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: '#0f172a' }}>
                {acc.title}
              </span>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: acc.color,
                background: acc.bg,
                padding: '0.1rem 0.4rem',
                borderRadius: '4px',
              }}>
                {acc.role}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {acc.email}
            </div>

            <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: '0.4rem' }}>
              👉 Click to fill & login
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickDemoAccounts;
