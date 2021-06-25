import { Select, conditionalAttribute, preventDefault } from '../../core/utils';
import { setVideoSource } from '../player';
import './filepicker.css';

// Refs
const fileInput = Select<HTMLInputElement>('input#file-picker'),
   fileBackdrop = Select<HTMLDivElement>('.file-picker-backdrop');

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
   if (target.files?.length) {
      setVideoSource(target.files[0]);
   }
});
