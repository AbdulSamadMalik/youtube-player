export const areEqual = (...args: any) => {
   return new Set(args).size === 1;
};

export const $ = <T extends HTMLElement>(selector: string): T | null => {
   return document.querySelector(selector);
};

export const $$ = (selector: string): HTMLElement[] | [] => {
   return Array.from(document.querySelectorAll(selector));
};

export const conditionalAttribute = (
   element: HTMLElement | null | undefined,
   condition: boolean | null | undefined,
   attrName: string,
   attrValue = '',
) => {
   if (!element || !attrName || condition === undefined || condition === null) {
      return false;
   }

   if (areEqual(condition, true)) {
      element.setAttribute(attrName, attrValue);
   } else if (areEqual(condition, false)) {
      element.removeAttribute(attrName);
   }

   return true;
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
