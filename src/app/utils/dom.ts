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
      !(element instanceof HTMLElement) ||
      !attrName === undefined ||
      condition === undefined ||
      condition === null
   ) {
      return;
   }

   if (condition === true) {
      element.setAttribute(attrName, attrValue);
   } else if (condition === false) {
      element.removeAttribute(attrName);
   }
};
