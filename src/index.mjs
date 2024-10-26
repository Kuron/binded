
import { binded } from './binded.mjs';
import { profileAllMethods } from './utils.mjs';

const profilingStats = {};

window.binded = {
  bind: (elem, opts) => {
    const ret = (opts.timings ? profileAllMethods(binded, profilingStats) : binded).init(elem, opts);
    opts.timings && console.table(profilingStats);
    return ret;
  },
  register: () => { throw new Error('binded: Not implemented'); },
};

