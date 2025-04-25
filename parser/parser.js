// parser.js
// Loads and interprets the gamebook JSON script
class GamebookParser {
    constructor(data) {
        this.data = data;
        this.state = {};
        this.currentNode = null;
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
            if (act['$set']) {
                Object.assign(this.state, act['$set']);
            } else if (act['$goto']) {
                this.goto(act['$goto']);
            } else if (act['$text']) {
                output += act['$text'] + '\n';
            } else if (act['$if']) {
                if (this.evalCondition(act['$if'])) {
                    if (Array.isArray(act['$if']['$then'])) {
                        output += this.performActions(act['$if']['$then']);
                    } else if (act['$if']['$then']) {
                        output += act['$if']['$then'] + '\n';
                    }
                } else if (act['$if']['$else']) {
                    if (Array.isArray(act['$if']['$else'])) {
                        output += this.performActions(act['$if']['$else']);
                    } else if (act['$if']['$else']) {
                        output += act['$if']['$else'] + '\n';
                    }
                }
            }
        }
        return output;
    }
}

export default GamebookParser;
