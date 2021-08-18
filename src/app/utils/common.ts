export const parseBool = (str: string) => {
   return str.toLowerCase() == 'true';
};

export const createObjectURL = (source: File | Blob) => {
   if (source instanceof File || source instanceof Blob) {
      if (URL) return URL.createObjectURL(source);
      if (webkitURL) return webkitURL.createObjectURL(source);
   }
   throw new Error('Not a file or blob');
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

export const asyncTimer = (ms: number): Promise<void> => {
   return new Promise((resolve) => setTimeout(resolve, ms));
};
