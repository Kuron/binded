
import { binded } from './binded.mjs';

const stats = {};
const wrapMethod = function (obj, method) {
  const oldMethod = obj[method];
  stats[method] = { count: 0, total: 0, min: null, max: null, mean: null };
  return function () {
    const start = Date.now();
    const ret = oldMethod.apply(this, arguments);
    const dur = Date.now() - start;
    const stat = stats[method];
    Object.assign(stat, {
      count: stat.count + 1,
      total: stat.total + dur,
      min: stat.min === null ? dur : Math.min(stat.min, dur), 
      max: stat.max === null ? dur : Math.max(stat.max, dur),
      mean: (stat.total + dur) / (stat.count + 1), 
    });
    return ret;
  };
};
const wrapAll = obj => Object.keys(obj).reduce((a, method) => (a[method] = wrapMethod(obj, method), a), {});

window.binded = {
  bind: (elem, opts) => {
    const ret = (opts.timings ? wrapAll(binded) : binded).init(elem, opts);
    opts.timings && console.table(stats);
    return ret;
  },
  register: () => { throw new Error('binded: Not implemented'); },
};

