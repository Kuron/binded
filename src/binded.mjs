
import { attributes } from './attrs.mjs';
import { operators } from './operators.mjs';

const logError = msg => console.error(`${msg}`);
const identRegex = /^[a-z][a-z0-9\-_.]{0,63}$/i;
const bindScopeContext = Symbol();
const attrPrefixDefault = 'binded';

export const binded = {
  init(elem, opts) {
    const start = Date.now();
    const { map, proxyMap } = this.createMap();
    this.findScope(elem, map, opts);
    console.info(`binded: Initialized in ${Date.now() - start}ms`);
    return proxyMap;
  },

  createMap() {
    const map = {};
    const proxyMap = new Proxy(map, {
      set(target, prop) {
        if (prop in target)
          return Reflect.set(...arguments);
        throw new Error(`binded: Property does not exist, ${prop}`);
      },
    });
    return { map, proxyMap };
  },

  findScope(elem, parentMap, { context, attrPrefix } = {}) {
    const processingContext = [];
    const bindedScopeAttrName = `${attrPrefix ?? attrPrefixDefault}-scope`;
    const bindScopeElems = (elem.hasAttribute(bindedScopeAttrName) ? [elem] : [])
      .concat([...elem.querySelectorAll(`[${bindedScopeAttrName}]`)])
      .filter(elem => {
        if (elem[bindScopeContext])
          return false;
        const expStr = elem.getAttribute(bindedScopeAttrName);
        const expObjs = this.parseBindedExp(expStr);
        if (!expObjs || expObjs.length !== 1 || expObjs[0].operator !== 'as') 
          throw new Error(`Invalid expression for ${bindedScopeAttrName}, "${expStr}"`);
        return true;
      });

    if (!bindScopeElems.length)
      throw new Error(`No unprocessed binded scopes were found. Declare a scope with the following, "[binded-scope="as name"]"`);

    bindScopeElems.forEach(elem => {
      const { map, proxyMap } = this.createMap();
      processingContext.push([ elem, elem.parentNode, elem.nextSibling ]);
      elem.parentNode.removeChild(elem);
   
      const expStr = elem.getAttribute(bindedScopeAttrName);
      const expObjs = this.parseBindedExp(expStr);
      elem[bindScopeContext] = { alias: expObjs[0].right, map, proxyMap };
    });

    bindScopeElems.forEach(elem => {
      const { map } = elem[bindScopeContext];
      [...elem.getElementsByTagName('*')].forEach(elem => this.inspectElem({ elem, map, context, attrPrefix }));
    });

    for (let i = processingContext.length - 1; i > -1; i--) {
      const [ child, parent, sibling ] = processingContext[i];
      parent.insertBefore(child, sibling);
    }

    for (let i = 0; i < processingContext.length; i++) {
      const [ child ] = processingContext[i];
      const { alias, proxyMap } = child[bindScopeContext];
      const parentScope = child.parentNode.closest(`[${bindedScopeAttrName}]`);

      if (parentScope) {
        if (alias in parentScope[bindScopeContext].map)
          logError(`Duplicate scope name and alias found, "${alias}". The scope will overwrite the existing value.`);
        parentScope[bindScopeContext].map[alias] = proxyMap;
      }
      else
        parentMap[alias] = proxyMap;
    }

    while (processingContext.length) {
      const [ child ] = processingContext.shift();
      child[bindScopeContext].map = null;
      child[bindScopeContext].proxyMap = null;
    }
  },

  inspectElem({ context, elem, map, attrPrefix }) {
    attributes.forEach(({ name, descriptor, processor }) => {
      const attrName = `${attrPrefix ?? attrPrefixDefault}-${name}`;
      if (!elem.hasAttribute(attrName))
        return;
      const expObjs = this.parseBindedExp(elem.getAttribute(attrName));
      if (!expObjs || !expObjs.length)
        return;
      expObjs.forEach(expObj => {
        if (!(expObj.operator in processor))
          throw new Error(`Invalid operator used for binder "${name}", "${expObj.operator}"`);
        if (descriptor) {
          if (descriptor.reqContext && (!context || !context[name]))
            throw new Error(`This binder is missing a required context, "${name}"`);
          if (descriptor.reqLeft && !expObj.left)
            throw new Error(`The left operand is required for this binder, "${name}"`);
        }
        processor[expObj.operator]({ elem, expObj, map, context: context?.[name] });
      });
    });
  },

  // Expects: [<left-operand>] <operator> <right-operand> ["and" ...]
  parseBindedExp(str) {
    if (!str || typeof str !== 'string' || !str.trim().length)
      throw new Error('An expression is required')
    return str.trim().split('and').map(exp => {
      const tokens = exp.trim().split(/\s+/g);

      if (tokens.length < 2 || tokens.length > 3)
        throw new Error(`Invalid expression specified, ${exp}`);
      if (tokens.length === 2)
        tokens.unshift(null);
      if (tokens[0] && !identRegex.test(tokens[0]))
        throw new Error(`Invalid left operand name, ${tokens[0]}`);
      if (!(tokens[1] in operators))
        throw new Error(`Unknown operator, ${tokens[1]}`);
      if (!identRegex.test(tokens[2]))
        throw new Error(`Invalid right operand name, ${tokens[2]}`);

      const leftParts = tokens[0] && tokens[0].split('.');
      const rightParts = tokens[2].split('.');

      if (leftParts && leftParts.some(part => !part))
        throw new Error(`Invalid left operand attribute, ${tokens[0]}`);
      if (rightParts.some(part => !part))
        throw new Error(`Invalid right operand attribute, ${tokens[2]}`);

      return {
        left: leftParts && leftParts[0],
        leftAttrs: leftParts && leftParts.splice(1),
        operator: tokens[1],
        right: rightParts[0],
        rightAttrs: rightParts.splice(1),
      };
    }).filter(obj => obj);
  },
};

