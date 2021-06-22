import {
   Select,
   conditionalAttribute,
   getFromLocalStorage,
   saveToLocalStorage,
   prefersDarkTheme,
} from './utils';
import { registerHotkey } from './hotkeys';
import { BehaviorSubject } from 'rxjs';

// Observables
export const isDarkTheme = new BehaviorSubject(false);

// Constants
const html = Select('html');

const toggleDarkTheme = (isDark?: boolean) => {
   isDark = isDark ?? !html?.hasAttribute('dark');
   conditionalAttribute(html, isDark, 'dark');
   saveToLocalStorage('isDarkTheme', isDark);
   isDarkTheme.next(isDark);
};

document.addEventListener('DOMContentLoaded', () => {
   const isDark = getFromLocalStorage('isDarkTheme', prefersDarkTheme());
   toggleDarkTheme(isDark);
});

registerHotkey({ eventCode: 'KeyX', ctrlKey: true, handler: () => toggleDarkTheme() });
