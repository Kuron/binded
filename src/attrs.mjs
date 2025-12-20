
import { operators } from './operators.mjs';
import { getStore, setStore, setStoreWhenUnload } from './store.mjs';

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
    descriptor: { validRightAttrs: ['prevent', 'stop'] },
    processor: {
      on({ elem, expObj: { left: funcName, leftAttrs: funcModifiers, right: eventType, rightAttrs: eventModifiers }, context }) {
        return {
          afterBinded: funcModifiers?.includes('invoke') ? context[funcName] : null,
          cleanup: operators.on(elem, eventType, funcName ? context[funcName] : Function.prototype, eventModifiers),
        };
      },
    },
  },

  {
    name: 'hide',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem.style.display === 'none'; },
          set(value) { elem.style.display = value ? 'none' : 'revert'; },
        });
      },

      into({ elem, expObj: { right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem.style.display = value ? 'none' : 'revert',
        }, elem);
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
      as({ elem, expObj: { left: refName, leftAttrs: refModifiers, right: alias }, map }) {
        if (refModifiers?.includes('store')) {
          elem[refName] = getStore('prop', alias);
          setStoreWhenUnload(() => setStore('prop', alias, elem[refName]));
        }

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
    name: 'show',
    processor: {
      as({ elem, expObj: { right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem.style.display !== 'none'; },
          set(value) { elem.style.display = value ? 'revert' : 'none'; },
        });
      },

      into({ elem, expObj: { right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem.style.display = value ? 'revert' : 'none',
        }, elem);
      },
    },
  },
  
  {
    name: 'style',
    descriptor: { reqLeft: true },
    processor: {
      as({ elem, expObj: { left: refName, right: alias }, map }) {
        return operators.as(map, alias, {
          get() { return elem.style[refName]; },
          set(value) { elem.style[refName] = value; },
        });
      },

      into({ elem, expObj: { left: refName, right: alias }, map }) {
        return operators.into(map, alias, {
          set: (elem, value) => elem.style[refName] = value,
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

