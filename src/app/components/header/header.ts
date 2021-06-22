import Hotkeys from '../../core/hotkeys';
import { fromEvent, merge } from 'rxjs';
import { $, areEqual, conditionalAttribute } from '../../core/utils';
import { chooseFiles } from '../filepicker';
import './header.css';

// Refs
const searchForm = $<HTMLFormElement>('#search-form'),
   searchInput = $<HTMLInputElement>('#search-input'),
   searchContainer = $<HTMLDivElement>('.search-container'),
   chooseFileButton = $<HTMLButtonElement>('#choose-file-button'),
   headerHomeLink = $<HTMLAnchorElement>('.youtube-icon a');

// Methods
const focusSearchBar = () => {
   if (!areEqual(document.activeElement, searchInput)) {
      searchInput.focus();
   }
};

const blurSearchBar = () => {
   if (areEqual(document.activeElement, searchInput)) {
      searchInput.blur();
   }
};

const handleSearchFormSubmit = (ev: Event) => {
   ev.preventDefault();
   if (searchInput && searchInput.value) {
      searchInput.blur();
      const query = searchInput.value.replace(/\s+/g, '+');
      window.open(`https://youtube.com/results?search_query=${query}`);
   }
};

const handleHomeLinkClick = (e: MouseEvent) => {
   if (!e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
   }
};

const handleSearchBarFocus = () => {
   const searchBarFocused = areEqual(document.activeElement, searchInput);
   conditionalAttribute(searchContainer, searchBarFocused, 'has-focus', 'true');
};

// Event Listeners
merge(
   fromEvent<FocusEvent>(searchInput, 'focus'),
   fromEvent<FocusEvent>(searchInput, 'blur')
).subscribe(handleSearchBarFocus);

headerHomeLink.addEventListener('click', handleHomeLinkClick);
searchForm.addEventListener('submit', handleSearchFormSubmit);
chooseFileButton.addEventListener('click', chooseFiles);

// Hotkeys
Hotkeys.registerHotkey({
   eventCode: 'KeyC',
   handler: chooseFiles,
});

Hotkeys.registerHotkey({
   eventCode: 'Slash',
   disableOn: searchInput,
   handler: focusSearchBar,
});

Hotkeys.registerHotkey({
   eventCode: 'Escape',
   handler: blurSearchBar,
});
