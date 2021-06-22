import { $, conditionalAttribute, preventDefault } from '../../core/utils';
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

fileInput.addEventListener('change', () => {
   fileBackdropHidden(true);
});
