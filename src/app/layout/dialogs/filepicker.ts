import { $, conditionalAttribute } from '../../utils';
import { addVideosToPlaylist } from '../playlist';
import './filePicker.scss';

// Refs
const fileInput = $<HTMLInputElement>('.file-picker#input'),
   fileBackdrop = $<HTMLDivElement>('.file-picker#backdrop');

// Methods
const fileBackdropHidden = (condition: boolean) => {
   conditionalAttribute(fileBackdrop, condition, 'hidden');
   conditionalAttribute(document.body, !condition, 'no-scroll');
};

export function chooseFiles() {
   fileInput.click();
}

// Event Listeners
document.addEventListener('dragenter', (event) => {
   event.preventDefault();
   fileBackdropHidden(false);
});

fileBackdrop.addEventListener('dragleave', (event) => {
   event.preventDefault();
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
