
export const capitalize = str => str.length ? str[0].toUpperCase() + str.substring(1) : str;

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

export const iterateObj = function (obj, callback) {
  if (Array.isArray(obj)) {
    for (let i = 0, iLen = obj.length; i < iLen; i++)
      callback(obj[i], i, obj);
  }
  else {
    for (let key in obj)
      callback(obj[key], key, obj);
  }
};

export const walkObj = function self(obj, callback) {
  if (typeof obj === 'object' && obj) {
    iterateObj(obj, (value, key, obj) => {
      if (typeof value === 'object' && value)
        self(value, callback);
      else
        callback(value, key, obj);
    });
  }
  else
    throw new Error(`Unexpected type while walking object`);
};

