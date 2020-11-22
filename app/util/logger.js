/* eslint-disable no-console */
// TODO: bind loglevel with env variables
// I'm not yet sure about the way env variables
// will be implemented in project

// loglevel values:
// 0 - silence
// 1 - error
// 2 - warn
// 3 - info
// 4 - log
// 5 - trace

const logLevel = 5;

export default {
  trace(...args) {
    if (logLevel > 4) {
      console.trace(...args);
    }
  },

  log(...args) {
    if (logLevel > 3) {
      console.log(...args);
    }
  },

  info(...args) {
    if (logLevel > 2) {
      console.info(...args);
    }
  },

  warn(...args) {
    if (logLevel > 1) {
      console.warn(...args);
    }
  },

  error(...args) {
    if (logLevel > 0) {
      console.error(...args);
    }
  },
};
