import { $, conditionalAttribute, preventDefault } from '../../utils';
import { addVideosToPlaylist } from '../playlist';
import './filepicker.css';

// Refs
const fileInput = $<HTMLInputElement>('input#file-picker'),
   fileBackdrop = $<HTMLDivElement>('.file-picker-backdrop');

// Methods
const fileBackdropHidden = (condition: boolean) => {
   conditionalAttribute(fileBackdrop, condition, 'hidden');
};

export const chooseFiles = () => {
   fileInput.click();
};

// Event Listeners
window.addEventListener('dragenter', (e) => {
   preventDefault(e, true);
   fileBackdropHidden(false);
});

window.addEventListener('drop', (e) => {
   preventDefault(e, true);
   fileBackdropHidden(true);
});

fileBackdrop.addEventListener('dragleave', (e) => {
   preventDefault(e, true, true);
   fileBackdropHidden(true);
   console.log('%c dragleave', 'color: red');
});

fileInput.addEventListener('change', (e) => {
   fileBackdropHidden(true);
   const target = e.target as HTMLInputElement;

   if (!target.files || !target.files.length) {
      return;
   }

   addVideosToPlaylist(Array.from(target.files));
});
