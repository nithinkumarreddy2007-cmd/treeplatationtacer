import React from 'react';
import { BarChart3, Trees, Award, Globe, Database, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Sprout } from 'lucide-react';

export const Analytics = ({ stats, dbStatus }) => {
  const topSpecies = stats?.topSpecies || [];
  const topCities = stats?.topCities || [];
  const topPlanters = stats?.topPlanters || [];
  const totalTrees = stats?.totalTrees || 1;
  const survivalRate = stats?.survivalRate || 0;
  const co2Kg = stats?.estimatedCo2KgYear || 0;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Project Analytics & Impact Reports
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          Comprehensive evaluation of urban plantation metrics, biodiversity diversity, and MERN system status
        </p>
      </div>

      {/* MERN Stack Project Information Card */}
      <div className="card" style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
        color: '#ffffff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Sparkles size={18} color="#6ee7b7" />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff' }}>
            MERN Stack Architectural Highlights
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>
              M - MongoDB
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Mongoose schemas with indexes for rapid text search, geospatial coords, and timestamps.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>
              E & N - Express & Node.js
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              RESTful CRUD controllers, JWT authorization, error handlers, and aggregate analytics routes.
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: '#a7f3d0', fontWeight: 700, textTransform: 'uppercase' }}>
              R - React 18 & Vite
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Modern modular UI, context-based auth, instant filter engine, modals, and telemetry radar.
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Species Breakdown & Regional Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem',
      }}>
        {/* Species Distribution */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trees size={18} color="#059669" />
            <span>Top Planted Species</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Distribution of tree varieties contributing to biodiversity
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topSpecies.map((sp, idx) => {
              const pct = totalTrees > 0 ? Math.round((sp.count / totalTrees) * 100) : 0;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{sp.name}</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      {sp.count} trees ({pct}%)
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      borderRadius: '9999px',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Planters Leaderboard */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="#d97706" />
            <span>Planters Leaderboard</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
            Top community contributors who planted the most trees
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topPlanters.map((planter, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  background: idx === 0 ? '#fef3c7' : '#f8fafc',
                  border: idx === 0 ? '1px solid #fde68a' : '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: idx === 0 ? '#d97706' : '#cbd5e1',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}>
                    {idx + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>
                      {planter.name}
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: idx === 0 ? '#b45309' : '#059669' }}>
                  {planter.count} Planted
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Database & System Status Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '3rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="#3b82f6" />
          <span>Database Engine & API Health</span>
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Real-time server connectivity status and storage metrics
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Active Database Mode</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              {dbStatus?.mode || 'MongoDB / Mongoose'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: '0.2rem' }}>
              ● Operational & Responsive
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Backend Server Port</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              Port 5000 (Express.js)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: 600, marginTop: '0.2rem' }}>
              CORS & JWT Protection Active
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Frontend Interface</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
              Port 5173 (React / Vite)
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.2rem' }}>
              Hot Module Replacement (HMR)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
