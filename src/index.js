const debug = require("debug")("memoise");

/**
 * Memoise a function
 * @param {Function} fn
 */
function memoise(fn) {
  const table = {};
  return function (...args) {
    let cached = true;
    let res = table;
    for (const arg of args) {
      res = res[arg];
      if (res === undefined) {
        cached = false;
        break;
      }
    }
    if (!cached) {
      res = fn(...args);
      let t = table;
      for (let i = 0; i < args.length - 1; i++) {
        const next = t[args[i]];
        if (next === undefined) {
          t[args[i]] = {};
        }
        t = t[args[i]];
      }
      t[args[args.length - 1]] = res;
    }
    debug("cache %O", table);
    return res;
  };
}

module.exports = memoise;
