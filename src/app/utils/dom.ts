import { ImageType } from '../models';
import { isBool, isNull, isString } from './operator';

export const Select = <T extends HTMLElement>(selector: string): T => {
   return document.querySelector<T>(selector)!;
};

export const SelectAll = <T extends HTMLElement>(selector: string): T[] => {
   return Array.from(document.querySelectorAll<T>(selector)!);
};

export const addAttribute = (element: HTMLElement, attrName: string, attrVal: string = '') => {
   if (!(element instanceof HTMLElement) || !isString(attrName)) return;
   element.setAttribute(attrName, attrVal);
};

export const removeAttribute = (element: HTMLElement, attrName: string) => {
   if (!(element instanceof HTMLElement) || !isString(attrName)) return;
   element.removeAttribute(attrName);
};

export const conditionalAttribute = (
   element: HTMLElement,
   condition: boolean,
   attrName: string,
   attrValue = ''
) => {
   if (!(element instanceof HTMLElement) || isNull(attrName) || !isBool(condition)) {
      return;
   }

   if (condition === true) {
      element.setAttribute(attrName, attrValue);
   } else if (condition === false) {
      element.removeAttribute(attrName);
   }
};

export const canvasToBlob = (
   canvas: HTMLCanvasElement,
   type: ImageType,
   quality = 0.92
): Promise<Blob | null> => {
   if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Not a canvas');
   return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
   });
};

export const canvasToURL = (canvas: HTMLCanvasElement, type: ImageType, quality = 0.92): string => {
   if (!(canvas instanceof HTMLCanvasElement)) throw new Error('Not a canvas');
   return canvas.toDataURL(type, quality);
};
