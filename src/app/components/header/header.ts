import { ajax } from 'rxjs/ajax';
import { chooseFiles } from '../filepicker';
import { registerHotkey } from '../../hotkeys';
import { $, addAttribute, removeAttribute } from '../../utils/dom';
import {
   preventAnchorReload,
   preventDefault,
   getFromLocalStorage,
   saveToLocalStorage,
} from '../../utils/common';
import './header.css';

// Refs
const searchForm = $<HTMLFormElement>('#search-form'),
   searchInput = $<HTMLInputElement>('#search-input'),
   searchContainer = $<HTMLDivElement>('.search-container'),
   chooseFileButton = $<HTMLButtonElement>('#choose-file-button'),
   headerHomeLink = $<HTMLAnchorElement>('.youtube-icon a'),
   countryCode = $('.country-code');

// Methods
const focusSearchBar = () => {
   searchInput.focus();
   addAttribute(searchContainer, 'has-focus');
};

const blurSearchBar = () => {
   searchInput.blur();
   removeAttribute(searchContainer, 'has-focus');
};

const handleSearchFormSubmit = (ev: Event) => {
   preventDefault(ev, true, true);
   if (searchInput && searchInput.value) {
      searchInput.blur();
      const query = searchInput.value.replace(/\s+/g, '+');
      window.open(`https://youtube.com/results?search_query=${query}`);
   }
};

const setCountryCode = () => {
   const storedCode = getFromLocalStorage('countryCode');

   if (storedCode) {
      countryCode.innerHTML = storedCode;
      return;
   }

   ajax<IpInfo>('https://ipinfo.io/?token=e7f553952c3125').subscribe(({ response }) => {
      const { country } = response;
      countryCode.innerHTML = country;
      saveToLocalStorage('countryCode', country);
   });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', setCountryCode);
searchInput.addEventListener('focus', focusSearchBar);
searchInput.addEventListener('blur', blurSearchBar);
headerHomeLink.addEventListener('click', preventAnchorReload);
searchForm.addEventListener('submit', handleSearchFormSubmit);
chooseFileButton.addEventListener('click', chooseFiles);

// Hotkeys
registerHotkey({ eventCode: 'KeyC', handler: chooseFiles });
registerHotkey({ eventCode: 'Escape', handler: blurSearchBar });
registerHotkey({ eventCode: 'Slash', handler: focusSearchBar, disableOn: searchInput });
