import React from 'react';

export default function GameHistory({ history }) {
  return (
    <div ref={null} style={{ maxHeight: 500, overflowY: 'auto', background: '#232323', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      {history.map((entry, idx) => (
        <div key={idx} style={{ marginBottom: 20 }}>
          {entry.node && (
            <>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{entry.node.title}</div>
              <div style={{ marginBottom: 8, whiteSpace: 'pre-line' }}>{entry.text}</div>
            </>
          )}
          {entry.output && (
            <div style={{ color: '#b8ffb5', marginBottom: 8, whiteSpace: 'pre-line' }}>{entry.output}</div>
          )}
        </div>
      ))}
    </div>
  );
}
