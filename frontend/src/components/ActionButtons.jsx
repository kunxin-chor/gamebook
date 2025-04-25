import React from 'react';

export default function ActionButtons({ actions, onAction }) {
  return (
    <div>
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => onAction(action)}
          style={{ marginRight: 12, marginBottom: 8, padding: '10px 18px', borderRadius: 6, background: '#3c3c3c', color: '#fff', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', boxShadow: '0 1px 4px #0005' }}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
