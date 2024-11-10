
import { reservedContext } from './binded.mjs';
import { operators } from './operators.mjs';

export const attributes = [
  {
    name: 'attr',
    descriptor: { reqLeft: true },
    processor: {
      as({ elem, expObj: { left: refName, right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem.getAttribute(refName); },
          set(value) { elem.setAttribute(refName, value); },
        });
      },
      
      into({ elem, expObj: { left: refName, right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem.setAttribute(refName, value),
        }, elem);
      },
    },
  },

  {
    name: 'elem',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        return operators.as(map, alias, { value: elem });
      },
    },
  },

  {
    name: 'event',
    descriptor: { reqLeft: true, validRightAttrs: ['prevent', 'stop'] },
    processor: {
      on({ elem, expObj: { left: funcName, right: eventType, rightAttrs: eventModifiers }, context }) {
        return operators.on(elem, eventType, reservedContext.event[funcName] ?? context[funcName], eventModifiers);
      },
    },
  },

  {
    name: 'html',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem.innerHTML; },
          set(value) { elem.innerHTML = value; },
        });
      },

      into({ elem, expObj: { right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem.innerHTML = value,
        }, elem);
      },
    },
  },

  {
    name: 'prop',
    descriptor: { reqLeft: true },
    processor: {
      as({ elem, expObj: { left: refName, right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem[refName]; },
          set(value) { elem[refName] = value; },
        });
      },

      into({ elem, expObj: { left: refName, right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem[refName] = value,
        }, elem);
      },
    },
  },

  {
    name: 'text',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem.textContent; },
          set(value) { elem.textContent = value; },
        });
      },

      into({ elem, expObj: { right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem.textContent = value,
        }, elem);
      },
    },
  },
];

