import React from 'react';

export default function InventorySidebar({ inventory }) {
  return (
    <div style={{ minWidth: 180, background: '#23272e', color: '#ffe066', borderRadius: 10, marginRight: 24, padding: 16, height: 'fit-content', boxShadow: '0 2px 8px #0005' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 18 }}>Inventory</div>
      {inventory.length === 0 ? (
        <div style={{ color: '#aaa', fontStyle: 'italic' }}>Empty</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {inventory.map(item => (
            <li key={item.name} style={{ marginBottom: 6 }}>
              <span style={{ fontWeight: 500 }}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</span>
              {typeof item.value === 'number' ? ` x${item.value}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
