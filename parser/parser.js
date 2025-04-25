// parser.js
// Loads and interprets the gamebook JSON script
import { ActionHandlerRegistry, setHandler, gotoHandler, textHandler, ifHandler } from './actionHandlers.js';

class GamebookParser {
    constructor(data) {
        this.data = data;
        this.state = {};
        this.currentNode = null;
        this.actionHandlers = new ActionHandlerRegistry();
        // Register built-in handlers
        this.actionHandlers.register('$set', setHandler);
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
                }
            }
        }
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
        for (const key in cond) {
            if (key === '$then' || key === '$else') continue;
            if (typeof cond[key] === 'boolean') {
                if ((this.state[key] || false) !== cond[key]) return false;
            }
        }
        return true;
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
