// type type = 'log' | 'error' | 'info' | 'table' | 'timeStamp';

/** Custom Logger */
function log(...args: any[]) {
   import.meta.env.DEV && console.log(...['log', ...args]);
}

function error(...args: any[]) {
   import.meta.env.DEV && console.error(...['error', ...args]);
}

export default { log, error };
