export const areEqual = (...args: any) => {
   return new Set(args).size === 1;
};

export const $ = <T extends HTMLElement>(selector: string): T => {
   return document.querySelector(selector)!;
};

export const $$ = (selector: string): HTMLElement[] => {
   return Array.from(document.querySelectorAll(selector)!);
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

export const saveToLocalStorage = (name: string, value: any) => {
   localStorage.setItem(name, JSON.stringify({ value }));
};

export const getFromLocalStorage = (name: string) => {
   const stored = localStorage.getItem(name);
   if (stored === null) {
      return { value: null };
   }

   try {
      return { value: JSON.parse(stored).value };
   } catch (error) {
      return { value: null };
   }
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
