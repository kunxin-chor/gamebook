import React, { useState } from 'react';

export default function GiveDialog({ open, onClose, inventory, entities, onGive }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#23272e', color: '#ffe066', borderRadius: 12, padding: 28, minWidth: 320, boxShadow: '0 2px 16px #000a' }}>
        <h2 style={{ marginTop: 0 }}>Give Item</h2>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>Select Item:</div>
          <select value={selectedItem} onChange={e => setSelectedItem(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option value="">-- Choose an item --</option>
            {inventory.map(item => (
              <option key={item.name} value={item.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}{typeof item.value === 'number' ? ` x${item.value}` : ''}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>Select Entity:</div>
          <select value={selectedEntity} onChange={e => setSelectedEntity(e.target.value)} style={{ width: '100%', padding: 8 }}>
            <option value="">-- Choose an entity --</option>
            {entities.map(entity => (
              <option key={entity} value={entity}>{entity}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 6, background: '#444', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button
            disabled={!selectedItem || !selectedEntity}
            onClick={() => onGive(selectedItem, selectedEntity)}
            style={{ padding: '8px 18px', borderRadius: 6, background: '#ffe066', color: '#222', border: 'none', fontWeight: 600, cursor: !selectedItem || !selectedEntity ? 'not-allowed' : 'pointer' }}
          >Give</button>
        </div>
      </div>
    </div>
  );
}
