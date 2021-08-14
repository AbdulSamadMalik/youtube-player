import { random } from 'lodash-es';

export const createObjectURL = (source: File | Blob) => {
   if (source instanceof File || source instanceof Blob) {
      if (URL) return URL.createObjectURL(source);
      if (webkitURL) return webkitURL.createObjectURL(source);
   }
   throw new Error('Not a file or blob');
};

/** Prevents default behavior for an `Event` */
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

export const asyncTimer = (ms: number): Promise<void> => {
   return new Promise((resolve) => setTimeout(resolve, ms));
};
