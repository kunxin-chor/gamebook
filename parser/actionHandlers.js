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
  Object.assign(context.state, params);
  return '';
}

export function gotoHandler(context, params) {
  context.goto(params);
  return '';
}

export function textHandler(context, params) {
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
