export const isFunction = (fn: any): fn is Function => {
   return typeof fn === 'function';
};

export const isString = (val: any): val is string => {
   if (typeof val === 'string' && val !== '') {
      return true;
   }
   return false;
};

export const areEqual = (...args: any) => {
   return new Set(args).size === 1;
};

export const isNull = (val: any) => {
   if (val === 'undefined' || val === null) {
      return true;
   }
   return false;
};

export const isBool = (val: any): val is Boolean => typeof val === 'boolean';
