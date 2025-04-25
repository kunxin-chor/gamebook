// Action handler registry for SOLID-compliant parser extensibility
export class ActionHandlerRegistry {
  constructor() {
    this.handlers = {};
  }

  register(actionType, handler) {
    this.handlers[actionType] = handler;
  }

  get(actionType) {
    return this.handlers[actionType];
  }
}

// Built-in handlers
export function setHandler(context, params) {
  // Support setting numbers, strings, booleans
  Object.entries(params).forEach(([key, value]) => {
    context.state[key] = value;
  });
  return '';
}

export function incHandler(context, params) {
  // params: { var: 'coins', amount: 1 }
  const key = params.var;
  const amt = params.amount || 1;
  if (typeof context.state[key] !== 'number') context.state[key] = 0;
  context.state[key] += amt;
  return '';
}

export function decHandler(context, params) {
  // params: { var: 'coins', amount: 1 }
  const key = params.var;
  const amt = params.amount || 1;
  if (typeof context.state[key] !== 'number') context.state[key] = 0;
  context.state[key] -= amt;
  if (context.state[key] < 0) context.state[key] = 0;
  return '';
}

export function gotoHandler(context, params) {
  context.goto(params);
  return '';
}

export function textHandler(context, params) {
  // Variable interpolation: replace ${var} with context.state[var]
  if (typeof params === 'string') {
    params = params.replace(/\$\{([^}]+)\}/g, (match, varName) => {
      return context.state[varName] !== undefined ? context.state[varName] : 0;
    });
  }
  return params + '\n';
}

export function ifHandler(context, params) {
  let output = '';
  if (context.evalCondition(params)) {
    if (Array.isArray(params['$then'])) {
      output += context.performActions(params['$then']);
    } else if (params['$then']) {
      output += params['$then'] + '\n';
    }
  } else if (params['$else']) {
    if (Array.isArray(params['$else'])) {
      output += context.performActions(params['$else']);
    } else if (params['$else']) {
      output += params['$else'] + '\n';
    }
  }
  return output;
}

export function abilityCheckHandler(parser, params) {
  const statName = params.stat ? params.stat.toLowerCase() : 'mnd';
  const statValue = parser.state[`$character.${statName}`] || 0;
  const roll = Math.ceil(Math.random() * 20);
  const margin = statValue - roll;
  const success = margin >= 0;
  if (params.marginVar) {
      parser.state[params.marginVar] = margin;
  }
  if (params.successVar) {
      parser.state[params.successVar] = success;
  }
  return {
    rollMessage: `Ability Check: ${statName.toUpperCase()} ${statValue} vs d20 roll ${roll} → margin: ${margin} (${success ? 'Success' : 'Failure'})`,
    result: success ? 'success' : 'failure',
    margin,
    stat: statName,
    statValue,
    roll
  };
}
