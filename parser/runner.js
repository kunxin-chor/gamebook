// app.js
// Terminal-based runner for the gamebook
import readline from 'readline';
import path from 'path';
import fs from 'fs';
import GamebookParser from './parser.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const data = JSON.parse(fs.readFileSync('../data/dragonbones_cave.json', 'utf-8'));
const parser = new GamebookParser(data);
parser.start();

function showPassage() {
    console.clear();
    console.log(`== ${parser.currentNode.title} ==\n`);
    console.log(parser.getText() + '\n');
    const actions = parser.getActions();
    actions.forEach((a, i) => {
        console.log(`${i + 1}. ${a.label}`);
    });
    if (actions.length === 0) {
        console.log('\n[The End]');
        rl.close();
        return;
    }
    rl.question('\nChoose an action: ', answer => {
        const idx = parseInt(answer) - 1;
        if (isNaN(idx) || idx < 0 || idx >= actions.length) {
            console.log('Invalid choice. Press Enter to try again.');
            rl.question('', () => showPassage());
            return;
        }
        const action = actions[idx];
        const output = parser.performActions(action['$do'] || []);
        if (output) {
            console.log('\n' + output);
            rl.question('Press Enter to continue...', () => showPassage());
        } else {
            showPassage();
        }
    });
}

showPassage();
