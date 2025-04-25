import React, { useEffect, useState, useRef } from 'react';
import { createGamebookParser } from './parser.js';



function App() {
  const parserRef = useRef(createGamebookParser());
  const parser = parserRef.current;
  const scrollRef = useRef(null);

  const [history, setHistory] = useState([
    { node: parser.currentNode, text: parser.getText() }
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const actions = parser.getActions();

  function handleAction(action) {
    const output = parser.performActions(action['$do'] || []);
    const hasGoto = action['$do'] && action['$do'].some(act => act['$goto']);
    const entries = [];

    if (output && output.trim()) {
      entries.push({ actionLabel: action.label, output });
    }
    if (hasGoto) {
      entries.push({ node: parser.currentNode, text: parser.getText() });
    }
    if (entries.length > 0) {
      setHistory(prev => [...prev, ...entries]);
    }
    // No need to force re-render; updating history is enough
  }


  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'serif', background: '#1a1a1a', color: '#f6f6f6', borderRadius: 12, boxShadow: '0 2px 12px #000a', padding: 24 }}>
      <h1 style={{ textAlign: 'center', letterSpacing: 2, marginBottom: 24 }}>Dragonbones Cave</h1>
      <div ref={scrollRef} style={{ maxHeight: 500, overflowY: 'auto', background: '#232323', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        {history.map((entry, idx) => (
          <div key={idx} style={{ marginBottom: 24 }}>
            {entry.node && (
              <>
                <div style={{ fontWeight: 'bold', fontSize: 18 }}>{entry.node.title}</div>
                <div style={{ whiteSpace: 'pre-line', margin: '8px 0' }}>{entry.text}</div>
              </>
            )}
            {entry.actionLabel && (
              <div style={{ color: '#7ad', fontStyle: 'italic', marginBottom: 4 }}>→ {entry.actionLabel}</div>
            )}
            {entry.output && (
              <div style={{ color: '#b2f', marginTop: 4, whiteSpace: 'pre-line' }}>{entry.output}</div>
            )}
          </div>
        ))}
      </div>
      <div>
        {actions.length > 0 ? (
          actions.map((a, i) => (
            <button
              key={a.id}
              style={{ margin: '0 8px 8px 0', padding: '8px 18px', borderRadius: 6, border: 'none', background: '#7ad', color: '#222', fontWeight: 'bold', cursor: 'pointer', fontSize: 16 }}
              onClick={() => handleAction(a)}
            >
              {a.label}
            </button>
          ))
        ) : (
          <div style={{ color: '#aaa', marginTop: 16, textAlign: 'center', fontWeight: 'bold' }}>[The End]</div>
        )}
      </div>
    </div>
  );
}

export default App;
