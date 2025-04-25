import React, { useEffect, useState, useRef } from 'react';
import gamebookData from './assets/dragonbones_cave.json';
import { createGamebookParser } from './parser.js';
import InventorySidebar from './components/InventorySidebar';
import InteractionsSidebar from './components/InteractionsSidebar';
import GiveDialog from './components/GiveDialog';
import GameHistory from './components/GameHistory';
import ActionButtons from './components/ActionButtons';
import CharacterSidebar from './components/CharacterSidebar';



function App() {
  const parser = useRef(createGamebookParser(gamebookData)).current;
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

  // Supported interaction types
  const INTERACTION_TYPES = [
    { type: '$give', label: 'Give' },
    { type: '$speak', label: 'Speak' },
    { type: '$use', label: 'Use' },
    { type: '$examine', label: 'Examine' }
  ];

  // Get current node entities (for dialog options)
  const entities = parser.currentNode && parser.currentNode.entities ? parser.currentNode.entities : [];

  // GIVE dialog state
  const [showGiveDialog, setShowGiveDialog] = useState(false);

  function handleTriggerInteraction(interactionType) {
    if (interactionType === '$give') {
      setShowGiveDialog(true);
    } else {
      alert(`Interaction type '${interactionType}' is not implemented yet.`);
    }
  }

  function handleGive(item, entity) {
    setShowGiveDialog(false);
    // Find matching $give interaction in current node
    const node = parser.currentNode;
    if (!node || !node.interactions) return;
    const match = node.interactions.find(intx => intx.type === '$give' && intx.entity === entity && intx.item === item);
    if (match) {
      const output = parser.performActions(match.actions);
      setHistory(prev => [
        ...prev,
        { actionLabel: `Give ${item} to ${entity}`, output }
      ]);
    } else {
      setHistory(prev => [
        ...prev,
        { actionLabel: `Give ${item} to ${entity}`, output: `Nothing happens.` }
      ]);
    }
  }

  // Use parser.getCharacterStats() for live character stats
  const character = parser.getCharacterStats();

  return (
    <div style={{ display: 'flex', flexDirection: 'row', maxWidth: 1200, margin: '40px auto', fontFamily: 'serif' }}>
      <div>
        <InventorySidebar inventory={inventory} />
        <InteractionsSidebar
          interactionTypes={INTERACTION_TYPES}
          onTrigger={handleTriggerInteraction}
        />
      </div>
      <div style={{ flex: 1, background: '#1a1a1a', color: '#f6f6f6', borderRadius: 12, boxShadow: '0 2px 12px #000a', padding: 24 }}>
        <h1 style={{ textAlign: 'center', letterSpacing: 2, marginBottom: 24 }}>Dragonbones Cave</h1>
        <GameHistory history={history} />
        <ActionButtons actions={actions} onAction={handleAction} />
      </div>
      <CharacterSidebar character={character} />
      <GiveDialog
        open={showGiveDialog}
        onClose={() => setShowGiveDialog(false)}
        inventory={inventory}
        entities={entities}
        onGive={handleGive}
      />
    </div>
  );
}


export default App;
