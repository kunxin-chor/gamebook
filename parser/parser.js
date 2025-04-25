// parser.js
// Loads and interprets the gamebook JSON script
import { ActionHandlerRegistry, setHandler, abilityCheckHandler, incHandler, decHandler, gotoHandler, textHandler, ifHandler } from './actionHandlers.js';



class GamebookParser {
    // ... existing code ...
    getInventory() {
        // Return array of { name, value } for inventory items
        return Object.entries(this.state)
            .filter(([key, value]) => key.startsWith('$inventory.') && ((typeof value === 'number' && value > 0) || (typeof value === 'boolean' && value) || (typeof value === 'string' && value)))
            .map(([key, value]) => ({ name: key.replace('$inventory.', ''), value }));
    }

    getCharacterStats() {
        // Return object of { str, agi, mnd, spr }
        return {
            str: this.state['$character.str'] || 0,
            agi: this.state['$character.agi'] || 0,
            mnd: this.state['$character.mnd'] || 0,
            spr: this.state['$character.spr'] || 0
        };
    }

    constructor(data) {
        this.data = data;
        this.state = {};
        this.currentNode = null;
        this.actionHandlers = new ActionHandlerRegistry();

        // Load Character
        // Load character variables if present
        if (data.character && data.character.variables) {
            Object.entries(data.character.variables).forEach(([key, value]) => {
                this.state[key] = value;
            });
        }

        // Register built-in handlers
        this.actionHandlers.register('$set', setHandler);
        this.actionHandlers.register('$inc', incHandler);
        this.actionHandlers.register('$dec', decHandler);
        this.actionHandlers.register('$goto', gotoHandler);
        this.actionHandlers.register('$text', textHandler);
        this.actionHandlers.register('$if', ifHandler);

        this.actionHandlers.register('$ability_check', abilityCheckHandler);

    }

    start() {
        this.goto(1); // Start at id 1
    }

    goto(id) {
        // nodes are now in data.nodes
        const node = (this.data.nodes || []).find(n => n.id === id);
        if (!node) throw new Error(`Node with id ${id} not found`);
        this.currentNode = node;
    }

    getText() {
        const textObj = this.currentNode.text;
        let text = textObj['$default'] || '';
        if (Array.isArray(textObj['$concat'])) {
            for (const part of textObj['$concat']) {
                if (part['$if']) {
                    if (this.evalCondition(part['$if'])) {
                        text += part['$if']['$then'] || '';
                    }
                } else if (typeof part === 'string') {
                    text += part;
                }
            }
        }
        // Variable interpolation: replace ${var} with state[var]
        text = text.replace(/\$\{(\w+)\}/g, (match, varName) => {
            return this.state[varName] !== undefined ? this.state[varName] : 0;
        });
        return text;
    }

    getActions() {
        return (this.currentNode.actions || []).filter(action => {
            if (action['$visible']) {
                return this.evalCondition(action['$visible']['$if']);
            }
            return true;
        });
    }

    evalCondition(cond) {
        if ('$or' in cond) {
            return cond['$or'].some(sub => this.evalCondition(sub));
        }
        if ('$and' in cond) {
            return cond['$and'].every(sub => this.evalCondition(sub));
        }
        // Comparison operators
        if ('$lt' in cond) {
            const [a, b] = cond['$lt'];
            return this.evalValue(a) < this.evalValue(b);
        }
        if ('$lte' in cond) {
            const [a, b] = cond['$lte'];
            return this.evalValue(a) <= this.evalValue(b);
        }
        if ('$gt' in cond) {
            const [a, b] = cond['$gt'];
            return this.evalValue(a) > this.evalValue(b);
        }
        if ('$gte' in cond) {
            const [a, b] = cond['$gte'];
            return this.evalValue(a) >= this.evalValue(b);
        }
        if ('$eq' in cond) {
            const [a, b] = cond['$eq'];
            return this.evalValue(a) === this.evalValue(b);
        }
        if ('$neq' in cond) {
            const [a, b] = cond['$neq'];
            return this.evalValue(a) !== this.evalValue(b);
        }
        // $random returns a float between 0 and 1
        if ('$random' in cond) {
            const max = cond['$random'] || 1;
            return Math.random() * max;
        }
        for (const key in cond) {
            if (key === '$then' || key === '$else') continue;
            if (typeof cond[key] === 'boolean') {
                if ((this.state[key] || false) !== cond[key]) return false;
            }
        }
        return true;
    }

    // Helper to evaluate a value or nested condition
    evalValue(val) {
        if (typeof val === 'object' && val !== null) {
            // If it's a condition object, evaluate it
            return this.evalCondition(val);
        }
        return val;
    }

    performActions(actions) {
        if (!Array.isArray(actions)) actions = [actions];
        let output = '';
        for (const action of actions) {
            if (typeof action === 'string') {
                // ... legacy string action ...
                continue;
            }
            const key = Object.keys(action)[0];
            const params = action[key];
            const handler = this.actionHandlers.get(key);
            if (handler) {
                const result = handler(this, params);
                if (key === '$ability_check' && result && typeof result === 'object' && result.rollMessage) {
                    output += result.rollMessage + '\n';
                    // Handle margin branching if present
                    if (params.margins && params.margins[result.result]) {
                        output += this.performActions([params.margins[result.result]]);
                    }
                } else {
                    output += result;
                }
            } else {
                // ... handle unknown action ...
            }
        }
        return output;
    }

    registerActionHandler(type, handler) {
        this.actionHandlers.register(type, handler);
    }
}

export default GamebookParser;
