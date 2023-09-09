const debug = require("debug")("memoise");

/**
 * Memoise a function
 * @param {Function} fn
 */
function memoise(fn) {
  let table = {};
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

    if (args.length === 0) {
      cached = !(typeof table === "object" && Object.keys(table).length === 0);
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
      if (args.length === 0) {
        table = res; 
      } else {
        t[args[args.length - 1]] = res;
      }
    }

    debug("cache %O", table);
    return res;
  };
}

module.exports = memoise;
