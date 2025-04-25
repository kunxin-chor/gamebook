import React from 'react';

export default function CharacterSidebar({ character }) {
  return (
    <div style={{ minWidth: 180, background: '#23272e', color: '#6ee7b7', borderRadius: 10, marginLeft: 24, marginTop: 20, padding: 16, height: 'fit-content', boxShadow: '0 2px 8px #0005' }}>
      <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 18 }}>Character Stats</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 16, letterSpacing: 1 }}>
        <li><span style={{ fontWeight: 600 }}>STR</span>: {character.str}</li>
        <li><span style={{ fontWeight: 600 }}>AGI</span>: {character.agi}</li>
        <li><span style={{ fontWeight: 600 }}>MND</span>: {character.mnd}</li>
        <li><span style={{ fontWeight: 600 }}>SPR</span>: {character.spr}</li>
      </ul>
    </div>
  );
}
