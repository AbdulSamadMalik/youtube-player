const str = (value: any) => {
   if (!value) return '';
   return value.toString();
};

export const padStart = (value: string, maxLength = 2, fillString = '0') => {
   return value.padStart(maxLength, fillString);
};

export const formatTime = (seconds: number, minPad = 2, secPad = 2) => {
   if (!seconds) return '0:00';

   const hours = Math.floor(seconds / 3600),
      mins = Math.floor((seconds - hours * 3600) / 60),
      secs = Math.floor(seconds - hours * 3600 - mins * 60);

   let formattedTime;
   formattedTime = `${str(mins).padStart(minPad, '0')}:${str(secs).padStart(secPad, '0')}`;

   hours >= 1 && (formattedTime = `${hours}:${formattedTime}`);

   return formattedTime;
};

export const formatDate = (time: Date) => {
   if (!time) time = new Date();

   const dt = new Date(time),
      date = dt.getDate(),
      month = dt.getMonth(),
      year = dt.getFullYear(),
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
   return `${date} ${months[month]} ${year}`;
};
