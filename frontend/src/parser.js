// Thin ES module wrapper to use the shared parser in the frontend
import GamebookParser from '../../parser/parser.js';
import gamebookData from './assets/dragonbones_cave.json';

export function createGamebookParser(initialState = {}) {
  // Provide a clean instance for each session
  const parser = new GamebookParser(gamebookData);
  parser.state = { ...initialState };
  parser.currentNode = parser.data.find(n => n.id === 1);
  return parser;
}

export { GamebookParser };
