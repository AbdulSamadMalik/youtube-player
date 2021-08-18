import { Observable } from 'rxjs';
import { isBoolean, isNil, isString } from 'lodash-es';

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
   if (!(element instanceof HTMLElement) || isNil(attrName) || !isBoolean(condition)) {
      throw new Error(JSON.stringify({ element, attrName, condition }));
   }

   if (condition === true) {
      element.setAttribute(attrName, attrValue);
   } else if (condition === false) {
      element.removeAttribute(attrName);
   }
};

export const conditionalClass = (element: HTMLElement, condition: boolean, className: string) => {
   if (!(element instanceof HTMLElement) || isNil(className) || !isBoolean(condition)) {
      throw new Error(JSON.stringify({ element, className, condition }));
   }

   if (condition === true) {
      element.classList.add(className);
   } else if (condition === false) {
      element.classList.remove(className);
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

/** Converts an Element to behave like a Range Input */
export const toRangeInput = (element: HTMLElement) => {
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
