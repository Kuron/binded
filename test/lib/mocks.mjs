
const mockAllFuncs = (t, obj) => {
  Object.keys(obj)
    .filter(key => typeof obj[key] === 'function')
    .forEach(key => t.mock.method(obj, key));
  return obj;
};

export const mockElem = t => mockAllFuncs(t, {
  addEventListener: () => undefined,
});

export const mockEvent = t => mockAllFuncs(t, {
  preventDefault: () => undefined,
  stopPropagation: () => undefined,
});

