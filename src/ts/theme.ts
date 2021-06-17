import { $, conditionalAttribute, getFromLocalStorage, saveToLocalStorage } from './utils';
import Hotkeys from './hotkeys';
import { BehaviorSubject } from 'rxjs';

// Observables
export const isDarkTheme = new BehaviorSubject(false);

// Constants
const html = $('html');

const toggleDarkTheme = (isDark?: boolean) => {
  isDark = isDark ?? !html?.hasAttribute('dark');
  conditionalAttribute(html, isDark, 'dark');
  saveToLocalStorage('isDarkTheme', isDark);
  isDarkTheme.next(isDark);
};

document.addEventListener('DOMContentLoaded', () => {
  const isDark = getFromLocalStorage('isDarkTheme');
  toggleDarkTheme(Boolean(isDark));
});

Hotkeys.registerHotkey({
  eventCode: 'KeyX',
  ctrlKey: true,
  handler: () => toggleDarkTheme(),
});
