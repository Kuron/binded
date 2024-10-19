
export const operators = {
  as(map, alias, descriptor) {
    Object.defineProperty(map, alias, descriptor);
  },

  into(map, alias, { set }, elem) {
    const privatePropName = `$${alias}`;
    if (!(privatePropName in map))
      Object.defineProperty(map, privatePropName, { value: [] });
    if (!(alias in map))
      Object.defineProperty(map, alias, {
        get() { throw new Error(`binded: Cannot read collective value when "into" is used`); },
        set(value) { map[privatePropName].forEach(({ elem, set }) => set(elem, value)); },
      });
    map[privatePropName].push({ elem, set });
  },

  on(elem, eventType, callback, modifiers) {
    elem.addEventListener(eventType, function (event) { // TODO Cleanup?
      if (modifiers && modifiers.length) {
        if (modifiers.includes('prevent'))
          event.preventDefault();
        if (modifiers.includes('stop'))
          event.stopPropagation();
      }
      return callback.call(this, event);
    });
  },
};

