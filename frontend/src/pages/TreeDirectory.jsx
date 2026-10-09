import React, { useState } from 'react';
import { PlusCircle, LayoutGrid, Table as TableIcon, Eye, Edit, Trash2, MapPin, Calendar, Sprout, Search } from 'lucide-react';
import TreeCard from '../components/TreeCard.jsx';
import TreeFilters from '../components/TreeFilters.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const TreeDirectory = ({
  trees = [],
  loading = false,
  filters,
  setFilters,
  cities = [],
  onResetFilters,
  onOpenAddModal,
  onViewTree,
  onEditTree,
  onDeleteTree,
}) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const { isPlanterOrAdmin, isAdmin } = useAuth();

  return (
    <div>
      {/* Directory Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
              Planted Trees Directory
            </h1>
            <span style={{
              background: '#dcfce7',
              color: '#15803d',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}>
              {trees.length} Records
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
            Manage tree species, geographical locations, planting dates, and assigned planters
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Grid / Table Toggle */}
          <div style={{
            background: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
          }}>
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              style={{
                background: viewMode === 'grid' ? '#10b981' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.6rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              style={{
                background: viewMode === 'table' ? '#10b981' : 'transparent',
                color: viewMode === 'table' ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 0.6rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TableIcon size={16} />
            </button>
          </div>

          {isPlanterOrAdmin && (
            <button
              onClick={onOpenAddModal}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <PlusCircle size={17} />
              <span>Plant a Tree</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Component */}
      <TreeFilters
        filters={filters}
        setFilters={setFilters}
        cities={cities}
        onReset={onResetFilters}
      />

      {/* Records Container */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #d1fae5',
            borderTopColor: '#10b981',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem auto',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p>Loading tree records from database...</p>
        </div>
      ) : trees.length === 0 ? (
        <div className="card" style={{ padding: '3.5rem', textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            color: '#64748b',
          }}>
            <Sprout size={32} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>
            No tree records found
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            No planted trees matched your active search or filter criteria. Try resetting your filters or plant a new tree.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button onClick={onResetFilters} className="btn btn-secondary">
              Reset Filters
            </button>
            {isPlanterOrAdmin && (
              <button onClick={onOpenAddModal} className="btn btn-primary">
                Plant a Tree
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid */
        <div className="grid-cols-auto" style={{ marginBottom: '3rem' }}>
          {trees.map((tree) => (
            <TreeCard
              key={tree._id}
              tree={tree}
              onView={onViewTree}
              onEdit={onEditTree}
              onDelete={onDeleteTree}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="card" style={{ overflowX: 'auto', marginBottom: '3rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)', color: '#475569' }}>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Tree Name & Species</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Location</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Planter / Person</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Planted Date</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700 }}>Height</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trees.map((tree) => (
                <tr
                  key={tree._id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseOver={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{tree.commonName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#059669', fontStyle: 'italic' }}>
                      {tree.treeSpecies}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={tree.status} />
                  </td>
                  <td style={{ padding: '1rem', color: '#475569' }}>
                    <div style={{ fontWeight: 600 }}>{tree.location?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {tree.location?.city}{tree.location?.state ? `, ${tree.location.state}` : ''}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569' }}>
                    <div style={{ fontWeight: 600 }}>{tree.person?.name}</div>
                    {tree.person?.organization && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{tree.person.organization}</div>
                    )}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.8125rem' }}>
                    {tree.plantedDate ? new Date(tree.plantedDate).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#0f172a' }}>
                    {tree.heightCm || 30} cm
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        onClick={() => onViewTree(tree)}
                        className="btn btn-secondary btn-sm"
                        title="View Details"
                        style={{ padding: '0.35rem 0.5rem' }}
                      >
                        <Eye size={14} />
                      </button>
                      {isPlanterOrAdmin && (
                        <button
                          onClick={() => onEditTree(tree)}
                          className="btn btn-secondary btn-sm"
                          title="Edit"
                          style={{ padding: '0.35rem 0.5rem', color: '#0d9488' }}
                        >
                          <Edit size={14} />
                        </button>
                      )}
                      {(isAdmin || isPlanterOrAdmin) && (
                        <button
                          onClick={() => onDeleteTree(tree._id)}
                          className="btn btn-danger btn-sm"
                          title="Delete"
                          style={{ padding: '0.35rem 0.5rem' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TreeDirectory;
