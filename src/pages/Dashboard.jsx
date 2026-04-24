import React from 'react';
import { useNavigate } from 'react-router-dom';

function MacroBar({ label, current, goal, color }) {
  const pct = Math.min((current / goal) * 100, 100);
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: '#94a3b8' }}>
        <span>{label}</span><span style={{ color }}>{Math.round(current)}g</span>
      </div>
      <div style={{ height: 6, background: '#334155', borderRadius: 99 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.3s' }} />
      </div>
    </div>
  );
}

export default function Dashboard({ log, today, goals, removeEntry }) {
  const navigate = useNavigate();
  const entries = log[today] || [];
  const totals = entries.reduce((acc, e) => ({
    kcal: acc.kcal + (e.kcal || 0),
    protein: acc.protein + (e.protein || 0),
    carbs: acc.carbs + (e.carbs || 0),
    fat: acc.fat + (e.fat || 0),
  }), { kcal: 0, protein: 0, carbs: 0, fat: 0 });

  const kcalPct = Math.min((totals.kcal / goals.kcal) * 100, 100);
  const remaining = Math.max(goals.kcal - totals.kcal, 0);
  const over = totals.kcal > goals.kcal;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Heute 🍽</h1>
        <span style={s.date}>{new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>
      <div style={s.card}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: over ? '#ef4444' : '#10b981' }}>{Math.round(totals.kcal)}</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>von {goals.kcal} kcal</div>
          <div style={{ color: over ? '#ef4444' : '#94a3b8', fontSize: 13, marginTop: 4 }}>
            {over ? `⚠️ ${Math.round(totals.kcal - goals.kcal)} kcal drüber` : `${Math.round(remaining)} kcal verbleibend`}
          </div>
        </div>
        <div style={{ height: 10, background: '#334155', borderRadius: 99, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ width: `${kcalPct}%`, height: '100%', background: over ? '#ef4444' : '#10b981', borderRadius: 99, transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <MacroBar label="Protein" current={totals.protein} goal={goals.protein} color="#3b82f6" />
          <MacroBar label="Kohlenhydrate" current={totals.carbs} goal={goals.carbs} color="#f59e0b" />
          <MacroBar label="Fett" current={totals.fat} goal={goals.fat} color="#ec4899" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, margin: '0 16px 16px' }}>
        <button onClick={() => navigate('/add')} style={s.btnPrimary}>➕ Manuell</button>
        <button onClick={() => navigate('/camera')} style={s.btnSecondary}>📸 Foto scannen</button>
      </div>
      <div style={{ padding: '0 16px' }}>
        <h2 style={s.sectionTitle}>Mahlzeiten</h2>
        {entries.length === 0 ? (
          <div style={s.empty}>Noch nichts geloggt heute 🙂</div>
        ) : entries.map(e => (
          <div key={e.id} style={s.mealCard}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{e.name}</div>
              {e.grams && <div style={{ fontSize: 12, color: '#64748b' }}>{e.grams}g</div>}
              <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>P: {Math.round(e.protein)}g · KH: {Math.round(e.carbs)}g · F: {Math.round(e.fat)}g</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: '#10b981', fontSize: 16 }}>{Math.round(e.kcal)} kcal</div>
              <button onClick={() => removeEntry(today, e.id)} style={s.deleteBtn}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page: { padding: '16px 0 0' },
  header: { padding: '0 16px 16px' },
  title: { fontSize: 28, fontWeight: 800, color: '#f1f5f9' },
  date: { fontSize: 13, color: '#64748b' },
  card: { margin: '0 16px 16px', background: '#1e293b', borderRadius: 20, padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#94a3b8', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#475569', padding: '32px 0', fontSize: 15 },
  mealCard: { background: '#1e293b', borderRadius: 14, padding: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12 },
  btnPrimary: { flex: 1, padding: '12px 8px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  btnSecondary: { flex: 1, padding: '12px 8px', background: '#1e293b', color: '#10b981', border: '2px solid #10b981', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' },
  deleteBtn: { background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 16, marginTop: 4, padding: 4 },
};
