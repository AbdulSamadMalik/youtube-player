export const type = (val: any) => {
   return typeof val;
};

export const isFunction = (fn: any): fn is Function => {
   return type(fn) === 'function';
};

export const isString = (val: any): val is string => type(val) === 'string';

export const areEqual = (...args: any) => {
   return new Set(args).size === 1;
};
