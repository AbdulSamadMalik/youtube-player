import { BehaviorSubject } from 'rxjs';
import { registerHotkey } from './hotkeys';
import { Storage } from './services/Storage';
import { $, conditionalAttribute, prefersDarkTheme } from './utils';

const html = $<HTMLHtmlElement>('html');
const isDarkTheme = new BehaviorSubject<boolean>(false);

const setDarkTheme = (isDark: boolean) => {
   conditionalAttribute(html, isDark, 'dark');
   Storage.set('isDarkTheme', isDark);
};

const toggleDarkTheme = () => isDarkTheme.next(!isDarkTheme.value);

isDarkTheme.next(Storage.get('isDarkTheme', prefersDarkTheme()));
isDarkTheme.subscribe(setDarkTheme);

registerHotkey({ eventCode: 'KeyX', ctrlKey: true, keyup: true, handler: toggleDarkTheme });
