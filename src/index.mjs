
import { binded } from './binded.mjs';

window.binded = {
  bind: (elem, opts) => binded.init(elem, opts),
  register: () => { throw new Error('binded: Not implemented'); },
};

