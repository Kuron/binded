
export const profileMethod = (obj, method, stat) => {
  return wrapMethod(obj, method, function (proceed) {
    const start = Date.now();
    const ret = proceed();
    const dur = Date.now() - start;
    Object.assign(stat, {
      count: stat.count + 1,
      total: stat.total + dur,
      min: stat.min === null ? dur : Math.min(stat.min, dur), 
      max: stat.max === null ? dur : Math.max(stat.max, dur),
      mean: (stat.total + dur) / (stat.count + 1), 
    });
    return ret;
  });
};

export const wrapMethod = (obj, oldMethodName, newMethod) => {
  const oldMethod = obj[oldMethodName];
  return function () {
    const proceed = () => oldMethod.apply(this, arguments);
    return newMethod.call(undefined, proceed);
  };
};

export const profileAllMethods = (obj, stats) => {
  return Object.keys(obj).reduce((a, method) => {
    stats[method] = { count: 0, total: 0, min: null, max: null, mean: null };
    a[method] = profileMethod(obj, method, stats[method]);
    return a;
  }, {});
};

