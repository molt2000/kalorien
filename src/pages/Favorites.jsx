import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Favorites({ favorites, removeFavorite, today, addEntry }) {
  const navigate = useNavigate();
  const [grams, setGrams] = useState({});

  function handleAdd(f) {
    const g = parseFloat(grams[f.name]);
    if (!g) return alert('Gramm eintragen!');
    const factor = g / 100;
    addEntry(today, {
      name: f.name,
      kcal: Math.round(f.kcalPer100 * factor),
      protein: Math.round(f.protein * factor * 10) / 10,
      carbs: Math.round(f.carbs * factor * 10) / 10,
      fat: Math.round(f.fat * factor * 10) / 10,
      grams: g,
    });
    navigate('/');
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>⭐ Favoriten</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Gespeicherte Lebensmittel schnell hinzufügen</p>
      </div>
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#475569', padding: '48px 24px', fontSize: 14, lineHeight: 1.6 }}>
          Noch keine Favoriten.<br />Füge welche über Hinzufügen oder Foto scannen hinzu.
        </div>
      ) : favorites.map(f => (
        <div key={f.name} style={{ margin: '0 16px 12px', background: '#1e293b', borderRadius: 16, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>{f.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{f.kcalPer100} kcal · P:{f.protein}g · KH:{f.carbs}g · F:{f.fat}g / 100g</div>
            </div>
            <button onClick={() => removeFavorite(f.name)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#475569' }}>🗑</button>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input type="number" inputMode="decimal" placeholder="Gramm" value={grams[f.name] || ''}
              onChange={e => setGrams(g => ({ ...g, [f.name]: e.target.value }))}
              style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 12px', color: '#f1f5f9', fontSize: 14 }} />
            <button onClick={() => handleAdd(f)} style={{ padding: '10px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>
              + Hinzufügen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
