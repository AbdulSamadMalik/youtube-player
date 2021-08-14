export const str = (value: number | boolean): string => {
   if (!value) return '';
   return value.toString();
};

export const padStart = (value: string, maxLength = 2, fillString = '0') => {
   return value.padStart(maxLength, fillString);
};

export const formatVideoViews = (count: number) => {
   if (count > 1 && !isNaN(count)) {
      return `${count} views`;
   }
   return 'No Views';
};

export const formatTime = (seconds: number, minPad = 2, secPad = 2) => {
   if (isNaN(seconds)) seconds = 0;

   const hours = Math.floor(seconds / 3600),
      mins = Math.floor((seconds - hours * 3600) / 60),
      secs = Math.floor(seconds - hours * 3600 - mins * 60);

   let formattedTime;
   formattedTime = `${str(mins).padStart(minPad, '0')}:${str(secs).padStart(secPad, '0')}`;

   hours >= 1 && (formattedTime = `${hours}:${formattedTime}`);

   return formattedTime;
};

export const formatDate = (time: number) => {
   if (!time) time = Date.now();

   const dt = new Date(time),
      date = dt.getDate(),
      month = dt.getMonth(),
      year = dt.getFullYear(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   return `${date} ${months[month]} ${year}`;
};

export const removeExtension = (fileName: string) => {
   if ([2, 3, 4, 5].includes(fileName.length - fileName.lastIndexOf('.'))) {
      return fileName.slice(0, fileName.lastIndexOf('.'));
   }
   return fileName;
};

export const removeLetters = (string: string, letters: string) => {
   for (let letter of letters.split('')) {
      string = string.replace(new RegExp(letter, 'gm'), ' ');
   }
   return string.replace(/ +/gm, ' ');
};

export const formatFilename = (filename: string) => {
   filename = removeExtension(filename);
   filename = removeLetters(filename, '[](){}_=+');
   filename = filename.replace(/  +/g, ' ').trim();
   return filename;
};

export const megabyte = (bytes: number) => {
   if (typeof bytes !== 'number') {
      bytes = isNaN(parseInt(bytes)) ? 0 : parseInt(bytes);
   }
   return bytes / Math.pow(1024, 2);
};
