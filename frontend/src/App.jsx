import React, { useEffect, useState, useRef } from 'react';
import { createGamebookParser } from './parser.js';
import InventorySidebar from './components/InventorySidebar';
import GameHistory from './components/GameHistory';
import ActionButtons from './components/ActionButtons';



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
    const prevNodeId = parser.currentNode.id;
    const output = parser.performActions(action['$do'] || []);
    const newNodeId = parser.currentNode.id;
    const entries = [];

    if (output && output.trim()) {
      entries.push({ actionLabel: action.label, output });
    }
    if (newNodeId !== prevNodeId) {
      entries.push({ node: parser.currentNode, text: parser.getText() });
    }
    if (entries.length > 0) {
      setHistory(prev => [...prev, ...entries]);
    }
    // No need to force re-render; updating history is enough
  }

  const inventory = parser.getInventory();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', maxWidth: 900, margin: '40px auto', fontFamily: 'serif' }}>
      <InventorySidebar inventory={inventory} />
      <div style={{ flex: 1, background: '#1a1a1a', color: '#f6f6f6', borderRadius: 12, boxShadow: '0 2px 12px #000a', padding: 24 }}>
        <h1 style={{ textAlign: 'center', letterSpacing: 2, marginBottom: 24 }}>Dragonbones Cave</h1>
        <GameHistory history={history} />
        <ActionButtons actions={actions} onAction={handleAction} />
      </div>
    </div>
  );
}


export default App;
