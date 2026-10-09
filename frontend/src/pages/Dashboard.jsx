import React from 'react';
import { Trees, Heart, Wind, Users, PlusCircle, ArrowRight, CheckCircle2, AlertTriangle, Sprout } from 'lucide-react';
import StatusBadge from '../components/StatusBadge.jsx';
import TreeCard from '../components/TreeCard.jsx';
import InteractiveMap from '../components/InteractiveMap.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const Dashboard = ({
  stats,
  trees,
  onOpenAddModal,
  onViewTree,
  onEditTree,
  onDeleteTree,
  onNavigateDirectory,
}) => {
  const { isPlanterOrAdmin } = useAuth();

  const totalTrees = stats?.totalTrees ?? trees.length;
  const survivalRate = stats?.survivalRate ?? 92;
  const co2Kg = stats?.estimatedCo2KgYear ?? (totalTrees * 22);
  const statusCounts = stats?.statusCounts || {
    Healthy: 0,
    Growing: 0,
    Planted: 0,
    'Needs Attention': 0,
    Deceased: 0,
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        borderRadius: '20px',
        padding: '2.5rem',
        color: '#ffffff',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 25px rgba(6, 78, 59, 0.25)',
      }}>
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          opacity: 0.1,
          pointerEvents: 'none',
        }}>
          <Trees size={320} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '0.3rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}>
            <Sprout size={14} color="#6ee7b7" />
            <span>MERN Urban Reforestation Initiative</span>
          </div>

          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.875rem' }}>
            Track, Nurture & Grow Every Planted Tree.
          </h1>

          <p style={{ fontSize: '0.95rem', color: '#d1fae5', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            A complete MERN-stack platform to record tree species, geo-tagged plantation spots,
            assigned caretakers, and health milestones from sapling to mature canopy.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.875rem' }}>
            {isPlanterOrAdmin && (
              <button
                onClick={onOpenAddModal}
                className="btn btn-primary"
                style={{
                  background: '#ffffff',
                  color: '#064e3b',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
                  fontSize: '0.9rem',
                  padding: '0.75rem 1.4rem',
                }}
              >
                <PlusCircle size={18} color="#059669" />
                <span>Plant a Tree Now</span>
              </button>
            )}

            <button
              onClick={onNavigateDirectory}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                fontSize: '0.9rem',
                padding: '0.75rem 1.4rem',
              }}
            >
              <span>Explore Directory</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats Grid */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        {/* KPI 1: Total Trees */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803d',
            flexShrink: 0,
          }}>
            <Trees size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Planted Trees
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {totalTrees}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.2rem' }}>
              Across {stats?.topCities?.length || 2} Cities
            </div>
          </div>
        </div>

        {/* KPI 2: Survival & Health Rate */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#ccfbf1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0f766e',
            flexShrink: 0,
          }}>
            <Heart size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Survival Rate
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {survivalRate}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: 600, marginTop: '0.2rem' }}>
              Healthy & Actively Growing
            </div>
          </div>
        </div>

        {/* KPI 3: Carbon Offset */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#e0f2fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0284c7',
            flexShrink: 0,
          }}>
            <Wind size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              CO₂ Sequestration
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {co2Kg.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>kg/yr</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: '0.2rem' }}>
              Ecological Impact
            </div>
          </div>
        </div>

        {/* KPI 4: Planters & Volunteers */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#d97706',
            flexShrink: 0,
          }}>
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Contributors
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
              {stats?.topPlanters?.length || 4}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginTop: '0.2rem' }}>
              Volunteers & NGOs
            </div>
          </div>
        </div>
      </section>

      {/* Health Status Distribution Card */}
      <section className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
          Tree Health & Growth Breakdown
        </h3>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Monitoring biological conditions across the monitored urban canopy
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Healthy', count: statusCounts.Healthy || 0, color: '#15803d', bg: '#dcfce7' },
            { label: 'Growing', count: statusCounts.Growing || 0, color: '#0f766e', bg: '#ccfbf1' },
            { label: 'Planted', count: statusCounts.Planted || 0, color: '#0369a1', bg: '#e0f2fe' },
            { label: 'Needs Attention', count: statusCounts['Needs Attention'] || 0, color: '#b45309', bg: '#fef3c7' },
            { label: 'Deceased', count: statusCounts.Deceased || 0, color: '#be123c', bg: '#ffe4e6' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: item.bg,
                border: `1px solid ${item.color}20`,
                padding: '1rem',
                borderRadius: '12px',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: item.color, textTransform: 'uppercase' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: item.color, marginTop: '0.25rem' }}>
                {item.count}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                {totalTrees > 0 ? `${Math.round((item.count / totalTrees) * 100)}% of total` : '0%'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map Visualizer */}
      <InteractiveMap trees={trees} onSelectTree={onViewTree} />

      {/* Recent Planted Trees Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Recently Planted Trees
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Latest species planted and geo-tagged by field teams
            </p>
          </div>

          <button
            onClick={onNavigateDirectory}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <span>View All ({trees.length})</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid-cols-auto">
          {trees.slice(0, 3).map((tree) => (
            <TreeCard
              key={tree._id}
              tree={tree}
              onView={onViewTree}
              onEdit={onEditTree}
              onDelete={onDeleteTree}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
