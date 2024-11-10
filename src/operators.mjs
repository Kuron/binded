
export const operators = {
  as(map, alias, descriptor) {
    Object.defineProperty(map, alias, { ...descriptor, configurable: true });
    return () => Reflect.deleteProperty(map, alias);
  },

  into(map, alias, { set }, elem) {
    const privatePropName = `$${alias}`;
    if (!(privatePropName in map))
      Object.defineProperty(map, privatePropName, { configurable: true, value: [] });
    if (!(alias in map))
      Object.defineProperty(map, alias, {
        configurable: true,
        get() { throw new Error(`binded: Cannot read collective value when "into" is used`); },
        set(value) { map[privatePropName].forEach(({ elem, set }) => set(elem, value)); },
      });
    map[privatePropName].push({ elem, set });
    return () => {
      const i = map[privatePropName].findIndex(({ elem: elemLocal, set: setLocal }) => elem === elemLocal && set === setLocal);
      if (i === -1)
        return console.warn(`Failed to find elem to cleanup`, elem);
      map[privatePropName].splice(i, 1);
      if (!map[privatePropName].length) {
        Reflect.deleteProperty(map, privatePropName);
        Reflect.deleteProperty(map, alias);
      }
    };
  },

  on(elem, eventType, callback, modifiers) {
    if (!callback)
      throw new Error(`binded: Callback not specified`);
    const listener = function (event) {
      if (modifiers && modifiers.length) {
        if (modifiers.includes('prevent'))
          event.preventDefault();
        if (modifiers.includes('stop'))
          event.stopPropagation();
      }
      return callback.call(this, event);
    };
    elem.addEventListener(eventType, listener);
    return () => elem.removeEventListener(eventType, listener);
  },
};

