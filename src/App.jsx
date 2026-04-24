import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddMeal from './pages/AddMeal';
import Camera from './pages/Camera';
import History from './pages/History';
import Settings from './pages/Settings';
import Favorites from './pages/Favorites';

const NAV = [
  { path: '/', icon: '🏠', label: 'Home' },
  { path: '/add', icon: '➕', label: 'Hinzufügen' },
  { path: '/favorites', icon: '⭐', label: 'Favoriten' },
  { path: '/history', icon: '📅', label: 'Verlauf' },
  { path: '/settings', icon: '⚙️', label: 'Ziele' },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav style={styles.nav}>
      {NAV.map(n => (
        <button key={n.path} onClick={() => navigate(n.path)} style={{
          ...styles.navBtn,
          ...(location.pathname === n.path ? styles.navBtnActive : {})
        }}>
          <span style={{ fontSize: 22 }}>{n.icon}</span>
          <span style={styles.navLabel}>{n.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default function App() {
  const [log, setLog] = useState(() => { try { return JSON.parse(localStorage.getItem('kal_log') || '{}'); } catch { return {}; } });
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem('kal_favs') || '[]'); } catch { return []; } });
  const [goals, setGoals] = useState(() => { try { return JSON.parse(localStorage.getItem('kal_goals') || '{"kcal":2000,"protein":150,"carbs":200,"fat":70}'); } catch { return { kcal: 2000, protein: 150, carbs: 200, fat: 70 }; } });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { localStorage.setItem('kal_log', JSON.stringify(log)); }, [log]);
  useEffect(() => { localStorage.setItem('kal_favs', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('kal_goals', JSON.stringify(goals)); }, [goals]);

  function addEntry(date, entry) {
    setLog(prev => { const day = prev[date] || []; return { ...prev, [date]: [...day, { ...entry, id: Date.now() }] }; });
  }
  function removeEntry(date, id) {
    setLog(prev => ({ ...prev, [date]: (prev[date] || []).filter(e => e.id !== id) }));
  }
  function addFavorite(item) {
    setFavorites(prev => { if (prev.find(f => f.name === item.name)) return prev; return [item, ...prev]; });
  }
  function removeFavorite(name) {
    setFavorites(prev => prev.filter(f => f.name !== name));
  }

  const ctx = { log, today, goals, setGoals, favorites, addEntry, removeEntry, addFavorite, removeFavorite };

  return (
    <BrowserRouter>
      <div style={styles.app}>
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard {...ctx} />} />
            <Route path="/add" element={<AddMeal {...ctx} />} />
            <Route path="/camera" element={<Camera {...ctx} />} />
            <Route path="/favorites" element={<Favorites {...ctx} />} />
            <Route path="/history" element={<History {...ctx} />} />
            <Route path="/settings" element={<Settings {...ctx} />} />
          </Routes>
        </div>
        <NavBar />
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app: { display: 'flex', flexDirection: 'column', minHeight: '100dvh', maxWidth: 480, margin: '0 auto', background: '#0f172a' },
  content: { flex: 1, overflowY: 'auto', paddingBottom: 80 },
  nav: { position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, display: 'flex', background: '#1e293b', borderTop: '1px solid #334155', paddingBottom: 'env(safe-area-inset-bottom)' },
  navBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', gap: 2 },
  navBtnActive: { color: '#10b981' },
  navLabel: { fontSize: 10, fontWeight: 600 },
};
