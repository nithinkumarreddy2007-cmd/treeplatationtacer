import React, { useState, useEffect } from 'react';
import { api } from './api/client.js';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import TreeModal from './components/TreeModal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import TreeDirectory from './pages/TreeDirectory.jsx';
import Analytics from './pages/Analytics.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import { Trees, CheckCircle2, AlertCircle, Heart } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [trees, setTrees] = useState([]);
  const [stats, setStats] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    city: 'All',
    sort: '-plantedDate',
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('view'); // 'view' | 'add' | 'edit'
  const [activeTree, setActiveTree] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const { isAuthenticated, isPlanterOrAdmin } = useAuth();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTrees = async () => {
    try {
      setLoading(true);
      const res = await api.getTrees(filters);
      if (res.success) {
        setTrees(res.data);
      }
    } catch (err) {
      console.error('Error fetching trees:', err);
      showToast('Could not reach backend API server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.getStats();
      if (res.success) {
        setStats(res.stats);
        setDbStatus(res.dbStatus);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchTrees();
  }, [filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  // Compute unique cities for the filter dropdown
  const uniqueCities = Array.from(
    new Set(trees.map((t) => t.location?.city).filter(Boolean))
  );

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      city: 'All',
      sort: '-plantedDate',
    });
  };

  // Modal Handlers
  const handleOpenAddModal = () => {
    if (!isAuthenticated) {
      setCurrentTab('login');
      showToast('Please sign in or use demo accounts to plant a tree', 'error');
      return;
    }
    setActiveTree(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleViewTree = (tree) => {
    setActiveTree(tree);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditTree = (tree) => {
    if (!isAuthenticated) {
      setCurrentTab('login');
      showToast('Please sign in to update records', 'error');
      return;
    }
    setActiveTree(tree);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteTree = async (treeId) => {
    if (!window.confirm('Are you sure you want to delete this planted tree record?')) {
      return;
    }

    try {
      const res = await api.deleteTree(treeId);
      if (res.success) {
        showToast('Tree record removed successfully');
        fetchTrees();
        fetchStats();
      } else {
        showToast(res.message || 'Failed to delete record', 'error');
      }
    } catch (err) {
      showToast('Error executing delete operation', 'error');
    }
  };

  const handleSaveTree = async (treeData, treeId) => {
    if (modalMode === 'add') {
      const res = await api.createTree(treeData);
      if (res.success) {
        showToast(`Planted "${res.data.commonName}" successfully!`);
        fetchTrees();
        fetchStats();
      } else {
        throw new Error(res.message || 'Failed to plant tree');
      }
    } else if (modalMode === 'edit') {
      const res = await api.updateTree(treeId, treeData);
      if (res.success) {
        showToast(`Updated "${res.data.commonName}" successfully!`);
        fetchTrees();
        fetchStats();
      } else {
        throw new Error(res.message || 'Failed to update tree');
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Alert */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          animation: 'modalPop 0.2s ease',
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          {currentTab === 'dashboard' && (
            <Dashboard
              stats={stats}
              trees={trees}
              onOpenAddModal={handleOpenAddModal}
              onViewTree={handleViewTree}
              onEditTree={handleEditTree}
              onDeleteTree={handleDeleteTree}
              onNavigateDirectory={() => setCurrentTab('directory')}
            />
          )}

          {currentTab === 'directory' && (
            <TreeDirectory
              trees={trees}
              loading={loading}
              filters={filters}
              setFilters={setFilters}
              cities={uniqueCities}
              onResetFilters={handleResetFilters}
              onOpenAddModal={handleOpenAddModal}
              onViewTree={handleViewTree}
              onEditTree={handleEditTree}
              onDeleteTree={handleDeleteTree}
            />
          )}

          {currentTab === 'analytics' && (
            <Analytics stats={stats} dbStatus={dbStatus} />
          )}

          {currentTab === 'login' && (
            <Login
              onNavigateRegister={() => setCurrentTab('register')}
              onLoginSuccess={() => {
                showToast('Signed in successfully!');
                setCurrentTab('dashboard');
                fetchTrees();
                fetchStats();
              }}
            />
          )}

          {currentTab === 'register' && (
            <Register
              onNavigateLogin={() => setCurrentTab('login')}
              onRegisterSuccess={() => {
                showToast('Account created successfully!');
                setCurrentTab('dashboard');
                fetchTrees();
                fetchStats();
              }}
            />
          )}
        </div>
      </main>

      {/* Tree View/Add/Edit Modal */}
      <TreeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        tree={activeTree}
        onSave={handleSaveTree}
      />

      {/* Global Footer */}
      <footer style={{
        background: '#064e3b',
        color: '#d1fae5',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem 0',
        marginTop: 'auto',
      }}>
        <div className="container" style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Trees size={20} color="#34d399" />
            <span style={{ fontWeight: 700, color: '#ffffff' }}>EcoTrack Plantation Tracker</span>
            <span style={{ color: '#6ee7b7' }}>• MERN Stack Architecture</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#a7f3d0' }}>
            <span>MongoDB Database</span>
            <span>Express & Node.js REST API</span>
            <span>React Frontend</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
