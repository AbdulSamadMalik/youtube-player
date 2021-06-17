import { fromEvent, merge } from 'rxjs';
import Hotkeys from './hotkeys';
import { $, areEqual, conditionalAttribute } from './utils';

const searchForm = $<HTMLFormElement>('#search-form'),
   searchInput = $<HTMLInputElement>('#search-input'),
   searchContainer = $('.search-container');

searchForm?.addEventListener('submit', (ev) => {
   ev.preventDefault();
   if (searchInput && searchInput.value) {
      searchInput.blur();
      const query = searchInput.value.replace(/\s+/g, '+');
      window.open(`https://youtube.com/results?search_query=${query}`);
   }
});

merge(
   fromEvent<FocusEvent>(searchInput!, 'focus'),
   fromEvent<FocusEvent>(searchInput!, 'blur'),
).subscribe(() => {
   const searchBarFocused = areEqual(document.activeElement, searchInput);
   conditionalAttribute(searchContainer, searchBarFocused, 'has-focus', 'true');
});

const focusSearchBar = () => {
   if (!areEqual(document.activeElement, searchInput)) {
      searchInput?.focus();
   }
};

const blurSearchBar = () => {
   if (areEqual(document.activeElement, searchInput)) {
      searchInput?.blur();
   }
};

Hotkeys.registerHotkey({
   eventCode: 'Slash',
   disableOn: searchInput,
   handler: focusSearchBar,
});

Hotkeys.registerHotkey({
   eventCode: 'Escape',
   handler: blurSearchBar,
});
