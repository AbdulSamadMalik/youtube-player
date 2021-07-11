import { isFunction } from './operator';

export const saveToLocalStorage = (
   name: string,
   value: string | number | boolean | object | Array<any>
) => {
   localStorage.setItem(name, JSON.stringify({ value }));
};

export const getFromLocalStorage = (name: string, defaultValue: any = null) => {
   const stored = localStorage.getItem(name),
      getDefaultValue = () => (isFunction(defaultValue) ? defaultValue() : defaultValue);
   if (stored === null) {
      return getDefaultValue();
   }

   try {
      return JSON.parse(stored).value;
   } catch (error) {
      return getDefaultValue();
   }
};

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
      event.stopPropagation();
   }
};

export const generateVideoId = (length = 11) => {
   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
   const charactersArray = Array.from(characters);

   return Array(length)
      .fill(0)
      .map(() => charactersArray[Math.round(Math.random() * charactersArray.length)])
      .join('');
};

export const clamp = (number: number, min: number, max: number) => {
   if (isNaN(number) || isNaN(min) || isNaN(max)) {
      return 0;
   }
   return Math.max(min, Math.min(number, max));
};
