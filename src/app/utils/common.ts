import { random } from 'lodash-es';

export const createObjectURL = (source: File | Blob) => {
   if (!source) throw new Error('No file or blob object');

   const windowURL = window.URL || window.webkitURL;
   return windowURL.createObjectURL(source);
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
      event.stopImmediatePropagation();
   }
};

export const base64Id = (length = 25, base: string = '') => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

   for (let i = 0; i < length; i++) {
      base += characters[random(0, characters.length - 1)];
   }

   return base;
};

export const clamp = (number: number, min: number, max: number) => {
   if (isNaN(number) || isNaN(min) || isNaN(max)) {
      return 0;
   }
   return Math.max(min, Math.min(number, max));
};
