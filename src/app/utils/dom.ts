import { ImageType } from '../models';
import { isBool, isNull, isString } from './operator';
import { Observable } from 'rxjs';

export const $ = <T extends HTMLElement>(selector: string): T => {
   return document.querySelector<T>(selector)!;
};

export const $$ = <T extends HTMLElement>(selector: string): T[] => {
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
      throw new Error(JSON.stringify({ element, attrName, condition }));
   }

   if (condition === true) {
      element.setAttribute(attrName, attrValue);
   } else if (condition === false) {
      element.removeAttribute(attrName);
   }
};

// This function should be fast
export const setStyle = (element: HTMLElement, style: keyof CSSStyleDeclaration, value: string) => {
   if (element == undefined || value == undefined || typeof style !== 'string') {
      throw new Error(JSON.stringify({ element, value, style }));
   }
   element.style.setProperty(style, value);
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

export const elementToRange = (element: HTMLElement) => {
   return new Observable<number>((subscriber) => {
      let isMouseDown = false;

      const next = (e: MouseEvent, isClick: boolean = false) => {
         if (!isMouseDown && !isClick) return;
         const percent = (e.offsetX / element.offsetWidth) * 100;
         subscriber.next(percent);
      };

      // On Safari starting to slide temporarily triggers text selection mode which
      // show the wrong cursor. We prevent it by stopping the `selectstart` event.
      element.addEventListener('selectstart', (e) => e.preventDefault());

      element.addEventListener('mousemove', next);
      element.addEventListener('click', (e) => next(e, true));

      element.addEventListener('mouseup', () => (isMouseDown = false));
      element.addEventListener('mousedown', () => (isMouseDown = true));
      element.addEventListener('mouseleave', () => (isMouseDown = false));
   });
};
