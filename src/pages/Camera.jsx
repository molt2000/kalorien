import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Camera({ today, addEntry, addFavorite }) {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [grams, setGrams] = useState('');
  const [error, setError] = useState('');

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setImage(ev.target.result);
    reader.readAsDataURL(file);
    setResult(null); setError('');
  }

  async function analyze() {
    if (!image) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image }),
      });
      if (!res.ok) throw new Error('API Fehler');
      const data = await res.json();
      setResult(data);
    } catch (e) { setError('Analyse fehlgeschlagen. Prüfe deine Verbindung.'); }
    setLoading(false);
  }

  function calcPortioned() {
    if (!result || !grams) return null;
    const factor = parseFloat(grams) / 100;
    return {
      name: result.name,
      kcal: Math.round(result.kcalPer100 * factor),
      protein: Math.round(result.proteinPer100 * factor * 10) / 10,
      carbs: Math.round(result.carbsPer100 * factor * 10) / 10,
      fat: Math.round(result.fatPer100 * factor * 10) / 10,
      grams: parseFloat(grams),
    };
  }

  function handleAdd() {
    const entry = calcPortioned();
    if (!entry) return;
    addEntry(today, entry);
    addFavorite({ name: result.name, kcalPer100: result.kcalPer100, protein: result.proteinPer100, carbs: result.carbsPer100, fat: result.fatPer100 });
    navigate('/');
  }

  const portioned = calcPortioned();

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 16px' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: 15, cursor: 'pointer', padding: '0 0 8px' }}>← Zurück</button>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>📸 KI-Analyse</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Foto aufnehmen → KI erkennt Nährwerte automatisch</p>
      </div>
      <div style={{ margin: '0 16px', background: '#1e293b', borderRadius: 20, padding: 20 }}>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
        {!image ? (
          <button onClick={() => fileRef.current.click()} style={{ width: '100%', background: '#0f172a', border: '2px dashed #334155', borderRadius: 16, padding: '40px 20px', cursor: 'pointer', color: '#f1f5f9', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 48 }}>📷</div>
            <div style={{ fontWeight: 600, marginTop: 8 }}>Foto aufnehmen oder auswählen</div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Tippe hier</div>
          </button>
        ) : (
          <div>
            <img src={image} alt="Lebensmittel" style={{ width: '100%', borderRadius: 12, maxHeight: 260, objectFit: 'cover', marginBottom: 12 }} />
            <button onClick={() => { setImage(null); setResult(null); }} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>🔄 Anderes Foto</button>
          </div>
        )}
        {image && !result && (
          <button onClick={analyze} disabled={loading} style={{ width: '100%', padding: 14, background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 12 }}>
            {loading ? '🔍 Analyse läuft...' : '🤖 KI-Analyse starten'}
          </button>
        )}
        {error && <div style={{ background: '#7f1d1d', color: '#fca5a5', borderRadius: 10, padding: '10px 14px', marginTop: 12, fontSize: 14 }}>{error}</div>}
        {result && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', marginBottom: 4 }}>{result.name}</div>
            <div style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>Nährwerte pro 100g:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[['Kalorien', result.kcalPer100, 'kcal', '#10b981'], ['Protein', result.proteinPer100, 'g', '#3b82f6'], ['Kohlenhydrate', result.carbsPer100, 'g', '#f59e0b'], ['Fett', result.fatPer100, 'g', '#ec4899']].map(([label, val, unit, color]) => (
                <div key={label} style={{ background: '#0f172a', borderRadius: 10, padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ color, fontWeight: 700, fontSize: 18 }}>{Math.round(val)}<span style={{ fontSize: 11 }}>{unit}</span></div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 6 }}>Wie viel hast du gegessen? (g)</label>
              <input type="number" inputMode="decimal" value={grams} onChange={e => setGrams(e.target.value)} placeholder="z.B. 150"
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, padding: '10px 12px', color: '#f1f5f9', fontSize: 15 }} />
            </div>
            {grams && portioned && (
              <div style={{ background: '#0f172a', borderRadius: 14, padding: 14, marginTop: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#10b981' }}>Deine Portion ({grams}g):</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[portioned.kcal + ' kcal', 'P: ' + portioned.protein + 'g', 'KH: ' + portioned.carbs + 'g', 'F: ' + portioned.fat + 'g'].map(l => (
                    <span key={l} style={{ background: '#1e293b', color: '#10b981', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 600 }}>{l}</span>
                  ))}
                </div>
                <button onClick={handleAdd} style={{ width: '100%', padding: 14, background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', marginTop: 14 }}>
                  ✅ Zum Log hinzufügen
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
