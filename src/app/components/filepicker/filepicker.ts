import { $, conditionalAttribute, preventDefault } from '../../utils';
import { addVideosToPlaylist } from '../playlist';

// Refs
const fileInput = $<HTMLInputElement>('.file-picker#input'),
   fileBackdrop = $<HTMLDivElement>('.file-picker#backdrop');

// Methods
const fileBackdropHidden = (condition: boolean) => {
   conditionalAttribute(fileBackdrop, condition, 'hidden');
   conditionalAttribute(document.body, !condition, 'no-scroll');
};

export const chooseFiles = () => {
   fileInput.click();
};

// Event Listeners
document.addEventListener('dragenter', (event) => {
   preventDefault(event, true);
   fileBackdropHidden(false);
});

fileBackdrop.addEventListener('dragleave', (event) => {
   preventDefault(event, true, true);
   fileBackdropHidden(true);
});

fileInput.addEventListener('change', (event) => {
   fileBackdropHidden(true);

   const target = event.target as HTMLInputElement;

   if (!target.files || !target.files.length) {
      return;
   }

   addVideosToPlaylist(Array.from(target.files));
});

fileInput.addEventListener('drop', () => fileBackdropHidden(true));
