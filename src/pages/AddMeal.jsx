import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: 14, flex: 1 }}>
      <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        inputMode={type === 'number' ? 'decimal' : 'text'}
        style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 12px', color: '#f1f5f9', fontSize: 15, outline: 'none' }} />
    </div>
  );
}

export default function AddMeal({ today, addEntry, addFavorite, favorites }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', kcal: '', protein: '', carbs: '', fat: '', grams: '' });
  const [saved, setSaved] = useState(false);

  function handleChange(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function handleSubmit() {
    if (!form.name || !form.kcal) return alert('Name und Kalorien sind Pflicht!');
    addEntry(today, { name: form.name, kcal: parseFloat(form.kcal) || 0, protein: parseFloat(form.protein) || 0, carbs: parseFloat(form.carbs) || 0, fat: parseFloat(form.fat) || 0, grams: parseFloat(form.grams) || null });
    navigate('/');
  }

  function handleSaveFav() {
    if (!form.name || !form.kcal) return alert('Name und Kalorien eintragen!');
    addFavorite({ name: form.name, kcalPer100: parseFloat(form.kcal) || 0, protein: parseFloat(form.protein) || 0, carbs: parseFloat(form.carbs) || 0, fat: parseFloat(form.fat) || 0 });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 16px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: 15, cursor: 'pointer', padding: '0 0 8px' }}>← Zurück</button>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>Mahlzeit hinzufügen</h1>
      </div>
      <div style={{ margin: '0 16px 16px', background: '#1e293b', borderRadius: 20, padding: 20 }}>
        <Field label="Name *" value={form.name} onChange={v => handleChange('name', v)} placeholder="z.B. Hähnchenbrust" />
        <Field label="Kalorien (kcal) *" value={form.kcal} onChange={v => handleChange('kcal', v)} placeholder="200" type="number" />
        <div style={{ display: 'flex', gap: 10 }}>
          <Field label="Protein (g)" value={form.protein} onChange={v => handleChange('protein', v)} placeholder="30" type="number" />
          <Field label="Kohlenhydrate (g)" value={form.carbs} onChange={v => handleChange('carbs', v)} placeholder="0" type="number" />
          <Field label="Fett (g)" value={form.fat} onChange={v => handleChange('fat', v)} placeholder="5" type="number" />
        </div>
        <Field label="Gegessene Menge (g)" value={form.grams} onChange={v => handleChange('grams', v)} placeholder="150" type="number" />
        <button onClick={handleSaveFav} style={{ width: '100%', padding: 12, background: 'transparent', color: '#f59e0b', border: '1px solid #f59e0b', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', marginBottom: 8 }}>
          {saved ? '✅ Favorit gespeichert!' : '⭐ Als Favorit speichern'}
        </button>
        <button onClick={handleSubmit} style={{ width: '100%', padding: 14, background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          ✅ Zum Log hinzufügen
        </button>
      </div>
      {favorites.length > 0 && (
        <div style={{ padding: '0 16px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#94a3b8', marginBottom: 10 }}>Favoriten</h2>
          {favorites.map(f => (
            <button key={f.name} onClick={() => setForm({ name: f.name, kcal: f.kcalPer100, protein: f.protein, carbs: f.carbs, fat: f.fat, grams: '' })}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '12px 14px', marginBottom: 8, cursor: 'pointer', color: '#f1f5f9' }}>
              <span style={{ fontWeight: 600 }}>{f.name}</span>
              <span style={{ color: '#64748b', fontSize: 12 }}>{f.kcalPer100} kcal/100g</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
