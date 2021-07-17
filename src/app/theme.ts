import { BehaviorSubject } from 'rxjs';
import { registerHotkey } from './hotkeys';
import { Storage } from './services/Storage';
import { $, conditionalAttribute, prefersDarkTheme } from './utils';

// Observables
export const isDarkTheme = new BehaviorSubject(false);

// Constants
const html = $('html');

const toggleDarkTheme = () => {
   const isDark = !html?.hasAttribute('dark');
   Storage.set('isDarkTheme', isDark);
   isDarkTheme.next(isDark);
};

document.addEventListener('DOMContentLoaded', () => {
   const isDark = Storage.get('isDarkTheme', prefersDarkTheme());
   conditionalAttribute(html, isDark, 'dark');
});

registerHotkey({ eventCode: 'KeyX', ctrlKey: true, handler: toggleDarkTheme });
