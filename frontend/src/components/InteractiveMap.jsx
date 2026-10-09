import React, { useState } from 'react';
import { MapPin, Navigation, Eye, TreePine, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export const InteractiveMap = ({ trees = [], onSelectTree }) => {
  const [selectedPin, setSelectedPin] = useState(trees[0] || null);

  const treesWithCoords = trees.filter(
    (t) => t.location?.latitude && t.location?.longitude
  );

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={18} color="#10b981" />
            <span>Geographic Plantation Sites</span>
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Tracking {treesWithCoords.length} geo-tagged plantation spots across urban zones and parks
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 320px) 1fr',
        gap: '1.25rem',
        minHeight: '340px',
      }}>
        {/* Sites list */}
        <div style={{
          maxHeight: '340px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          paddingRight: '0.25rem',
        }}>
          {treesWithCoords.map((tree) => {
            const isSelected = selectedPin?._id === tree._id;
            return (
              <div
                key={tree._id}
                onClick={() => setSelectedPin(tree)}
                style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #10b981' : '1px solid #e2e8f0',
                  background: isSelected ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                    {tree.commonName}
                  </div>
                  <StatusBadge status={tree.status} />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={12} color="#0d9488" />
                  <span>{tree.location.name}, {tree.location.city}</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem' }}>
                  GPS: {tree.location.latitude?.toFixed(4)}, {tree.location.longitude?.toFixed(4)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Map Canvas / Radar Card */}
        <div style={{
          background: 'linear-gradient(145deg, #064e3b 0%, #065f46 60%, #047857 100%)',
          borderRadius: '12px',
          padding: '1.5rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.2)',
        }}>
          {/* Decorative background grid pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '0.25rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                Telemetry & Site Coordinates
              </span>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.5rem' }}>
                {selectedPin ? selectedPin.location?.name : 'Select a Tree'}
              </h4>
              <p style={{ fontSize: '0.8125rem', color: '#a7f3d0' }}>
                {selectedPin ? `${selectedPin.location?.city}, ${selectedPin.location?.state || 'India'}` : 'Click any site on the left list'}
              </p>
            </div>

            {selectedPin && (
              <button
                onClick={() => onSelectTree(selectedPin)}
                className="btn btn-secondary btn-sm"
                style={{ background: '#ffffff', color: '#065f46', border: 'none', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
              >
                <Eye size={14} />
                <span>Inspect Tree</span>
              </button>
            )}
          </div>

          {/* Center Coordinates & Details Card */}
          {selectedPin && (
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(8px)',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
            }}>
              <div>
                <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase' }}>Tree Species</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{selectedPin.commonName}</div>
                <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: '#6ee7b7' }}>{selectedPin.treeSpecies}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase' }}>GPS Coordinates</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fef08a' }}>
                  {selectedPin.location.latitude?.toFixed(4)}° N
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fef08a' }}>
                  {selectedPin.location.longitude?.toFixed(4)}° E
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase' }}>Planter / Caretaker</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{selectedPin.person?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>{selectedPin.person?.organization || 'Volunteer'}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.675rem', color: '#94a3b8', textTransform: 'uppercase' }}>Height & Status</div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{selectedPin.heightCm || 30} cm</div>
                <div style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>{selectedPin.status}</div>
              </div>
            </div>
          )}

          {/* Footer Coordinates Link */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#a7f3d0' }}>
            <span>Real-time location records synced with MongoDB</span>
            {selectedPin?.location?.latitude && (
              <a
                href={`https://www.google.com/maps?q=${selectedPin.location.latitude},${selectedPin.location.longitude}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#ffffff',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                <span>Open in Google Maps</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
