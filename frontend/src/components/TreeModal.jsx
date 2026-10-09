import React, { useState, useEffect } from 'react';
import { X, Sprout, MapPin, User, Calendar, Ruler, FileText, Check, AlertCircle, Phone, Mail } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

export const TreeModal = ({ isOpen, onClose, mode = 'view', tree = null, onSave }) => {
  const [formData, setFormData] = useState({
    treeSpecies: '',
    commonName: '',
    location: {
      name: '',
      city: '',
      state: '',
      latitude: '',
      longitude: '',
    },
    plantedDate: new Date().toISOString().split('T')[0],
    person: {
      name: '',
      email: '',
      phone: '',
      organization: '',
    },
    status: 'Planted',
    heightCm: 30,
    healthNotes: '',
    imageUrl: '',
    tags: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tree && (mode === 'edit' || mode === 'view')) {
      setFormData({
        treeSpecies: tree.treeSpecies || '',
        commonName: tree.commonName || '',
        location: {
          name: tree.location?.name || '',
          city: tree.location?.city || '',
          state: tree.location?.state || '',
          latitude: tree.location?.latitude ?? '',
          longitude: tree.location?.longitude ?? '',
        },
        plantedDate: tree.plantedDate ? new Date(tree.plantedDate).toISOString().split('T')[0] : '',
        person: {
          name: tree.person?.name || '',
          email: tree.person?.email || '',
          phone: tree.person?.phone || '',
          organization: tree.person?.organization || '',
        },
        status: tree.status || 'Planted',
        heightCm: tree.heightCm || 30,
        healthNotes: tree.healthNotes || '',
        imageUrl: tree.imageUrl || '',
        tags: Array.isArray(tree.tags) ? tree.tags.join(', ') : '',
      });
    } else if (mode === 'add') {
      setFormData({
        treeSpecies: '',
        commonName: '',
        location: {
          name: '',
          city: '',
          state: '',
          latitude: '',
          longitude: '',
        },
        plantedDate: new Date().toISOString().split('T')[0],
        person: {
          name: '',
          email: '',
          phone: '',
          organization: '',
        },
        status: 'Planted',
        heightCm: 45,
        healthNotes: '',
        imageUrl: '',
        tags: 'Native, Urban Greenery',
      });
    }
    setError('');
  }, [tree, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.commonName || !formData.treeSpecies || !formData.location.name || !formData.location.city || !formData.person.name) {
      setError('Please fill in all required fields: Species, Common Name, Site Name, City, and Planter Name.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        heightCm: Number(formData.heightCm),
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await onSave(payload, tree?._id);
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving tree record');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sprout size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>
                {mode === 'add' && 'Plant New Tree'}
                {mode === 'edit' && `Edit Tree: ${tree?.commonName}`}
                {mode === 'view' && tree?.commonName}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {mode === 'add' && 'Record tree details, coordinates, planting date, and assigned planter'}
                {mode === 'edit' && 'Update tree growth status, inspection notes, and measurements'}
                {mode === 'view' && `Scientific Species: ${tree?.treeSpecies}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '0.35rem',
              borderRadius: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {mode === 'view' && tree ? (
          <div style={{ padding: '1.5rem' }}>
            {/* Image Banner if available */}
            {tree.imageUrl && (
              <div style={{ marginBottom: '1.25rem', maxHeight: '220px', overflow: 'hidden', borderRadius: '12px' }}>
                <img
                  src={tree.imageUrl}
                  alt={tree.commonName}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: '#059669', fontStyle: 'italic', fontWeight: 600 }}>
                  {tree.treeSpecies}
                </span>
              </div>
              <StatusBadge status={tree.status} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginBottom: '1.25rem',
            }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Location</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{tree.location?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  {tree.location?.city}{tree.location?.state ? `, ${tree.location.state}` : ''}
                </div>
                {tree.location?.latitude && (
                  <div style={{ fontSize: '0.7rem', color: '#0d9488', marginTop: '0.2rem' }}>
                    GPS: {tree.location.latitude}, {tree.location.longitude}
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Planted By</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{tree.person?.name}</div>
                {tree.person?.organization && (
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>{tree.person.organization}</div>
                )}
                {tree.person?.email && (
                  <div style={{ fontSize: '0.7rem', color: '#3b82f6', marginTop: '0.2rem' }}>{tree.person.email}</div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Planting Date</div>
                <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>
                  {new Date(tree.plantedDate).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  Height: <strong>{tree.heightCm || 30} cm</strong>
                </div>
              </div>
            </div>

            {tree.healthNotes && (
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Health & Care Notes
                </h4>
                <p style={{
                  background: '#f1f5f9',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  color: '#334155',
                  lineHeight: 1.6,
                }}>
                  {tree.healthNotes}
                </p>
              </div>
            )}

            {tree.tags && tree.tags.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                  Tags / Attributes
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {tree.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#ecfdf5',
                        color: '#065f46',
                        border: '1px solid #a7f3d0',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Add / Edit Form */
          <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '8px',
                fontSize: '0.8125rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Common Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Neem Tree, Mango Tree"
                  value={formData.commonName}
                  onChange={(e) => setFormData({ ...formData, commonName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Botanical / Scientific Species *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Azadirachta indica"
                  value={formData.treeSpecies}
                  onChange={(e) => setFormData({ ...formData, treeSpecies: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Location Section */}
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem',
            }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} />
                <span>Location Details</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Site / Park / Address *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. KBR National Park Trail 3"
                    value={formData.location.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, name: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Hyderabad"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, city: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">State / Region</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Telangana"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, state: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 17.4126"
                    value={formData.location.latitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, latitude: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 78.4878"
                    value={formData.location.longitude}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: { ...formData.location, longitude: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Planter Person Section */}
            <div style={{
              background: '#f8fafc',
              padding: '1rem',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              marginBottom: '1rem',
            }}>
              <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={15} />
                <span>Person / Planter Details</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label className="form-label">Planter Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Nithin Reddy"
                    value={formData.person.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        person: { ...formData.person, name: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Organization / Group</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Green Earth Movement"
                    value={formData.person.organization}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        person: { ...formData.person, organization: e.target.value },
                      })
                    }
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. planter@earth.org"
                    value={formData.person.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        person: { ...formData.person, email: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.person.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        person: { ...formData.person, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status, Date & Measurements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Health Status *</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Planted">Planted</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Growing">Growing</option>
                  <option value="Needs Attention">Needs Attention</option>
                  <option value="Deceased">Deceased</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Planting Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.plantedDate}
                  onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.heightCm}
                  onChange={(e) => setFormData({ ...formData, heightCm: e.target.value })}
                />
              </div>
            </div>

            {/* Health Notes */}
            <div className="form-group">
              <label className="form-label">Health & Care Notes</label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Fenced with bamboo guards, watered weekly, pest control status..."
                value={formData.healthNotes}
                onChange={(e) => setFormData({ ...formData, healthNotes: e.target.value })}
              />
            </div>

            {/* Image URL & Tags */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Medicinal, Native, Shade"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary" disabled={saving}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Check size={16} />
                <span>{saving ? 'Saving...' : mode === 'add' ? 'Plant Tree' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TreeModal;
