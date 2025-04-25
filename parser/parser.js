// parser.js
// Loads and interprets the gamebook JSON script
import { ActionHandlerRegistry, setHandler, incHandler, decHandler, gotoHandler, textHandler, ifHandler } from './actionHandlers.js';

class GamebookParser {
    constructor(data) {
        this.data = data;
        this.state = {};
        this.currentNode = null;
        this.actionHandlers = new ActionHandlerRegistry();
        // Register built-in handlers
        this.actionHandlers.register('$set', setHandler);
        this.actionHandlers.register('$inc', incHandler);
        this.actionHandlers.register('$dec', decHandler);
        this.actionHandlers.register('$goto', gotoHandler);
        this.actionHandlers.register('$text', textHandler);
        this.actionHandlers.register('$if', ifHandler);
    }

    start() {
        this.goto(1); // Start at id 1
    }

    goto(id) {
        const node = this.data.find(n => n.id === id);
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

    performActions(doArr) {
        let output = '';
        for (const act of doArr) {
            for (const key in act) {
                const handler = this.actionHandlers.get(key);
                if (handler) {
                    output += handler(this, act[key]);
                }
            }
        }
        return output;
    }

    registerActionHandler(type, handler) {
        this.actionHandlers.register(type, handler);
    }
}

export default GamebookParser;
