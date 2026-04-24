import React from 'react';

export default function History({ log, goals }) {
  const days = Object.keys(log).sort((a, b) => b.localeCompare(a)).slice(0, 14);

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ padding: '0 16px 16px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>📅 Verlauf</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Letzte 14 Tage</p>
      </div>
      {days.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#475569', padding: '48px 0' }}>Noch keine Daten.</div>
      ) : days.map(day => {
        const entries = log[day] || [];
        const kcal = entries.reduce((a, e) => a + (e.kcal || 0), 0);
        const protein = entries.reduce((a, e) => a + (e.protein || 0), 0);
        const pct = Math.min((kcal / goals.kcal) * 100, 100);
        const over = kcal > goals.kcal;
        return (
          <div key={day} style={{ margin: '0 16px 12px', background: '#1e293b', borderRadius: 16, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9' }}>
                  {new Date(day).toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'short' })}
                </div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{entries.length} Mahlzeiten · P: {Math.round(protein)}g</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: over ? '#ef4444' : '#10b981' }}>{Math.round(kcal)}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>kcal</div>
              </div>
            </div>
            <div style={{ height: 6, background: '#334155', borderRadius: 99 }}>
              <div style={{ width: `${pct}%`, height: '100%', background: over ? '#ef4444' : '#10b981', borderRadius: 99 }} />
            </div>
            {entries.map(e => (
              <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{e.name}{e.grams ? ` (${e.grams}g)` : ''}</span>
                <span style={{ color: '#64748b', fontSize: 13 }}>{Math.round(e.kcal)} kcal</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
