import { $, conditionalAttribute, prefersDarkTheme } from './utils';
import { Storage } from './classes/Storage';
import { registerHotkey } from './hotkeys';
import { BehaviorSubject } from 'rxjs';

// Observables
export const isDarkTheme = new BehaviorSubject(false);

// Constants
const html = $('html');

const toggleDarkTheme = (isDark?: boolean) => {
   isDark = isDark ?? !html?.hasAttribute('dark');
   conditionalAttribute(html, isDark, 'dark');
   Storage.set('isDarkTheme', isDark);
   isDarkTheme.next(isDark);
};

document.addEventListener('DOMContentLoaded', () => {
   const isDark = Storage.get('isDarkTheme', prefersDarkTheme());
   toggleDarkTheme(isDark);
});

registerHotkey({ eventCode: 'KeyX', ctrlKey: true, handler: () => toggleDarkTheme() });
