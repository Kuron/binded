
const defaultStore = { prop: {} };
const unloadCallbacks = [];
let store = structuredClone(defaultStore);

try {
  if (localStorage && 'binded' in localStorage)
    store = JSON.parse(localStorage.binded);
  addEventListener('beforeunload', () => {
    while (unloadCallbacks.length)
      unloadCallbacks.shift()();
    localStorage.binded = JSON.stringify(store);
  });
}
catch (e) { console.warn('LocalStorage is not available', e); }

export const hasStore = (group, name) => group in store && (!name || name in store[group]);

export const getStore = (group, name) => hasStore(group, name) ? store[group][name] : null;

export const setStore = (group, name, value) => hasStore(group) ? (store[group][name] = value, null) : null;

export const setStoreWhenUnload = callback => unloadCallbacks.push(callback);

