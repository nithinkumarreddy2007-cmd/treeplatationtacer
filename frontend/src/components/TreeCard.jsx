import React from 'react';
import { MapPin, User, Calendar, Ruler, Edit, Trash2, Eye, ShieldCheck, Tag } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const TreeCard = ({ tree, onView, onEdit, onDelete }) => {
  const { isPlanterOrAdmin, isAdmin } = useAuth();

  const formattedDate = tree.plantedDate
    ? new Date(tree.plantedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown Date';

  // Fallback botanical background placeholder if no image provided
  const placeholderImg =
    tree.imageUrl ||
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image & Status Header */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
        <img
          src={placeholderImg}
          alt={tree.commonName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80';
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <StatusBadge status={tree.status} />
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontWeight: 600,
        }}>
          <Ruler size={13} color="#6ee7b7" />
          <span>{tree.heightCm || 30} cm height</span>
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.15rem' }}>
            {tree.commonName}
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#059669', fontStyle: 'italic', fontWeight: 600, marginBottom: '0.875rem' }}>
            {tree.treeSpecies}
          </p>
        </div>

        {/* Tree Details Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: '#475569', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={15} color="#0d9488" style={{ flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <strong>{tree.location?.name}</strong>, {tree.location?.city}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={15} color="#3b82f6" style={{ flexShrink: 0 }} />
            <span>
              Planted by: <strong>{tree.person?.name}</strong>
              {tree.person?.organization && ` (${tree.person.organization})`}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} color="#8b5cf6" style={{ flexShrink: 0 }} />
            <span>Planted on {formattedDate}</span>
          </div>
        </div>

        {/* Notes preview */}
        {tree.healthNotes && (
          <p style={{
            fontSize: '0.775rem',
            color: '#64748b',
            background: '#f8fafc',
            border: '1px solid #f1f5f9',
            padding: '0.5rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            "{tree.healthNotes}"
          </p>
        )}

        {/* Tags */}
        {tree.tags && tree.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem', marginTop: 'auto' }}>
            {tree.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #dcfce7',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '0.875rem',
          marginTop: 'auto',
        }}>
          <button
            onClick={() => onView(tree)}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Eye size={14} />
            <span>View Details</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {isPlanterOrAdmin && (
              <button
                onClick={() => onEdit(tree)}
                className="btn btn-secondary btn-sm"
                title="Edit tree information & status"
                style={{ color: '#0d9488', padding: '0.375rem 0.5rem' }}
              >
                <Edit size={14} />
              </button>
            )}

            {(isAdmin || isPlanterOrAdmin) && (
              <button
                onClick={() => onDelete(tree._id)}
                className="btn btn-danger btn-sm"
                title="Delete tree record"
                style={{ padding: '0.375rem 0.5rem' }}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeCard;
