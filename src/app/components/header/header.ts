import { ajax, AjaxError } from 'rxjs/ajax';
import { chooseFiles } from '../filepicker';
import { registerHotkey } from '../../hotkeys';
import { $, addAttribute, removeAttribute } from '../../utils/dom';
import { Storage } from '../../classes/Storage';
import { preventAnchorReload, preventDefault } from '../../utils/common';
import { catchError, map, Observable, of } from 'rxjs';

// Refs
const searchForm = $<HTMLFormElement>('#search-form'),
   searchInput = $<HTMLInputElement>('#search-input'),
   searchContainer = $<HTMLDivElement>('.search-container'),
   chooseFileButton = $<HTMLButtonElement>('#choose-file-button'),
   headerHomeLink = $<HTMLAnchorElement>('a.youtube-icon'),
   countryCode = $('.country-code'),
   header = $('header.header');

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

const getCountryCode = (): Observable<string> => {
   const stored = Storage.get<string>('countryCode');

   if (stored) {
      return of(stored);
   }

   return ajax<IpInfo>('https://ipinfo.io/?token=e7f553952c3125').pipe(
      map((request) => request.response.country),
      catchError((error: AjaxError) => {
         console.error('Error fetching country code', error);
         Storage.set<string>('countryCode', 'IN');
         return getCountryCode();
      })
   );
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
   getCountryCode().subscribe((code) => {
      countryCode.innerHTML = code;
   });
});

searchInput.addEventListener('focus', focusSearchBar);
searchInput.addEventListener('blur', blurSearchBar);
headerHomeLink.addEventListener('click', preventAnchorReload);
searchForm.addEventListener('submit', handleSearchFormSubmit);
chooseFileButton.addEventListener('click', chooseFiles);

// Hotkeys
registerHotkey({ eventCode: 'KeyC', handler: chooseFiles });
registerHotkey({ eventCode: 'Escape', handler: blurSearchBar });
registerHotkey({ eventCode: 'Slash', handler: focusSearchBar, disableOn: searchInput });

export { header };
