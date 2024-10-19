
import { operators } from './operators.mjs';

export const attributes = [
  {
    name: 'attr',
    descriptor: { reqLeft: true },
    processor: {
      as({ elem, expObj: { left: refName, right: alias }, map }) {
        operators.as(map, alias, {
          get() { return elem.getAttribute(refName); },
          set(value) { elem.setAttribute(refName, value); },
        });
      },
    },
  },

  {
    name: 'elem',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        operators.as(map, alias, { value: elem });
      },
    },
  },

  {
    name: 'event',
    descriptor: { reqContext: true, reqLeft: true },
    processor: {
      on({ elem, expObj: { left: funcName, right: eventType, rightAttrs: eventModifiers }, context }) {
        operators.on(elem, eventType, context[funcName], eventModifiers);
      },
    },
  },

  {
    name: 'html',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        operators.as(map, alias, {
          get() { return elem.innerHTML; },
          set(value) { elem.innerHTML = value; },
        });
      }
    },
  },

  {
    name: 'prop',
    descriptor: { reqLeft: true },
    processor: {
      as({ elem, expObj: { left: refName, right: alias }, map }) {
        operators.as(map, alias, {
          get() { return elem[refName]; },
          set(value) { elem[refName] = value; },
        });
      },

      into({ elem, expObj: { left: refName, right: alias }, map }) {
        operators.into(map, alias, {
          set: (elem, value) => elem[refName] = value,
        }, elem);
      }
    },
  },

  {
    name: 'text',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        operators.as(map, alias, {
          get() { return elem.innerText; },
          set(value) { elem.innerText = value; },
        });
      },
    },
  },
];

