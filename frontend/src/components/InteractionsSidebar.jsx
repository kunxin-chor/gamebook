import React from 'react';

export default function InteractionsSidebar({ interactionTypes, onTrigger }) {
  return (
    <div style={{ minWidth: 180, background: '#23272e', color: '#fcb900', borderRadius: 10, marginRight: 24, marginTop: 20, padding: 16, height: 'fit-content', boxShadow: '0 2px 8px #0005' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 18 }}>Interactions</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {interactionTypes.map((itype, idx) => (
          <li key={itype.type} style={{ marginBottom: 10 }}>
            <button
              style={{ width: '100%', background: '#3c3c3c', color: '#fcb900', border: 'none', borderRadius: 6, padding: '8px 0', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0005' }}
              onClick={() => onTrigger(itype.type)}
            >
              {itype.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
