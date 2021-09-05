import { registerHotkey } from './hotkeys';
import { conditionalAttribute, prefersDarkTheme, parseBool } from '../utils';

const IS_DARK_THEME = 'IS_DARK_THEME';

const setDarkTheme = (value: boolean) => {
   conditionalAttribute(document.documentElement, value, 'dark');
   localStorage.setItem(IS_DARK_THEME, value.toString());
};

(function () {
   const isDarkStored = localStorage.getItem(IS_DARK_THEME);
   const isDarkTheme = isDarkStored ? parseBool(isDarkStored) : prefersDarkTheme();
   setDarkTheme(isDarkTheme);
})();

const toggleDarkTheme = () => {
   setDarkTheme(!document.documentElement.hasAttribute('dark'));
};

registerHotkey({
   eventCode: 'KeyX',
   ctrlKey: true,
   keyup: true,
   handler: toggleDarkTheme,
});
