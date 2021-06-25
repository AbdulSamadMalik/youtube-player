export const areEqual = (...args: any) => {
   return new Set(args).size === 1;
};

export const Select = <T extends HTMLElement>(selector: string): T => {
   return document.querySelector<T>(selector)!;
};

export const SelectAll = <T extends HTMLElement>(selector: string): T[] => {
   return Array.from(document.querySelectorAll<T>(selector)!);
};

export const addAttribute = (element: HTMLElement, attrName: string, attrVal = '') => {
   if (!element || !attrName || !(element instanceof HTMLElement)) return;
   element.setAttribute(attrName, attrVal);
};

export const removeAttribute = (element: HTMLElement, attrName: string) => {
   if (!element || !attrName || !(element instanceof HTMLElement)) return;
   element.removeAttribute(attrName);
};

export const conditionalAttribute = (
   element: HTMLElement,
   condition: boolean,
   attrName: string,
   attrValue: string = ''
) => {
   if (
      !element ||
      !(element instanceof HTMLElement) ||
      !attrName ||
      condition === undefined ||
      condition === null
   ) {
      return;
   }

   if (areEqual(condition, true)) {
      element.setAttribute(attrName, attrValue);
   } else if (areEqual(condition, false)) {
      element.removeAttribute(attrName);
   }
};

export const saveToLocalStorage = (
   name: string,
   value: string | number | boolean | object | Array<any>
) => {
   localStorage.setItem(name, JSON.stringify({ value }));
};

export const getFromLocalStorage = (name: string, defaultValue: any = null) => {
   const stored = localStorage.getItem(name);
   if (stored === null) {
      return !isFunction(defaultValue) ? defaultValue : defaultValue();
   }

   try {
      return JSON.parse(stored).value;
   } catch (error) {
      return !isFunction(defaultValue) ? defaultValue : defaultValue();
   }
};

export const createObjectURL = (file: File | Blob) => {
   if (!file) throw new Error('No file or blob object');

   const windowURL = window.URL || window.webkitURL;
   return windowURL.createObjectURL(file);
};

/** Prevents default behaviour for an `Event` */
export const preventDefault = (
   event: Event,
   stopPropagation = false,
   stopImmediatePropagation = false
) => {
   event.preventDefault();
   stopPropagation && event.stopPropagation();
   stopImmediatePropagation && event.stopImmediatePropagation();
};

export const prefersDarkTheme = () => {
   if (!window.matchMedia) {
      return false;
   }
   return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const preventAnchorReload = (event: MouseEvent) => {
   if (!event.shiftKey && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      event.stopPropagation();
   }
};

export const type = (val: any) => {
   return typeof val;
};

export const isFunction = (fn: any): fn is Function => {
   return type(fn) === 'function';
};

export const isString = (val: any): val is string => type(val) === 'string';
