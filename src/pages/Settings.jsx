import React, { useState } from 'react';

export default function Settings({ goals, setGoals }) {
  const [form, setForm] = useState(goals);
  const [saved, setSaved] = useState(false);

  function save() {
    setGoals({ kcal: +form.kcal, protein: +form.protein, carbs: +form.carbs, fat: +form.fat });
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>⚙️ Ziele</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Deine täglichen Makro-Ziele</p>
      </div>
      <div style={{ margin: '0 16px 20px', background: '#1e293b', borderRadius: 20, padding: 20 }}>
        {[
          ['kcal', 'Kalorien (kcal/Tag)', '2000'],
          ['protein', 'Protein (g/Tag)', '150'],
          ['carbs', 'Kohlenhydrate (g/Tag)', '200'],
          ['fat', 'Fett (g/Tag)', '70'],
        ].map(([key, label, ph]) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>{label}</label>
            <input type="number" inputMode="decimal" value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={ph}
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 12px', color: '#f1f5f9', fontSize: 15, outline: 'none' }} />
          </div>
        ))}
        <button onClick={save} style={{ width: '100%', padding: 14, background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
          {saved ? '✅ Gespeichert!' : 'Ziele speichern'}
        </button>
      </div>
      <div style={{ padding: '0 16px', color: '#475569', fontSize: 13, lineHeight: 1.7 }}>
        💡 Deine Daten werden lokal auf deinem Gerät gespeichert. Kein Server, keine Cloud.
      </div>
    </div>
  );
}
