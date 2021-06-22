import { registerHotkey } from '../../core/hotkeys';
import {
   Select,
   areEqual,
   addAttribute,
   removeAttribute,
   preventAnchorReload,
} from '../../core/utils';
import { chooseFiles } from '../filepicker';
import './header.css';

// Refs
const searchForm = Select<HTMLFormElement>('#search-form'),
   searchInput = Select<HTMLInputElement>('#search-input'),
   searchContainer = Select<HTMLDivElement>('.search-container'),
   chooseFileButton = Select<HTMLButtonElement>('#choose-file-button'),
   headerHomeLink = Select<HTMLAnchorElement>('.youtube-icon a');

// Methods
const focusSearchBar = () => {
   addAttribute(searchContainer, 'has-focus');
   if (!areEqual(document.activeElement, searchInput)) {
      searchInput.focus();
   }
};

const blurSearchBar = () => {
   removeAttribute(searchContainer, 'has-focus');
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

// Event Listeners
searchInput.addEventListener('focus', focusSearchBar);
searchInput.addEventListener('blur', blurSearchBar);
headerHomeLink.addEventListener('click', preventAnchorReload);
searchForm.addEventListener('submit', handleSearchFormSubmit);
chooseFileButton.addEventListener('click', chooseFiles);

// Hotkeys
registerHotkey({ eventCode: 'KeyC', handler: chooseFiles });
registerHotkey({ eventCode: 'Escape', handler: blurSearchBar });
registerHotkey({ eventCode: 'Slash', handler: focusSearchBar, disableOn: searchInput });
