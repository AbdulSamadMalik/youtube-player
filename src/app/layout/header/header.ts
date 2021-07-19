import { ajax, AjaxError } from 'rxjs/ajax';
import { chooseFiles } from '../dialogs';
import { registerHotkey } from '../../hotkeys';
import { Storage } from '../../services/Storage';
import { catchError, map, Observable, of } from 'rxjs';
import { $, $$, addAttribute, removeAttribute } from '../../utils/dom';
import { preventAnchorReload, preventDefault } from '../../utils/common';
import { forEach } from 'lodash-es';

// Refs
const header = $('header.header'),
   countryCode = $('.country-code'),
   tooltipButtons = $$('.header [data-tooltip]'),
   searchForm = $<HTMLFormElement>('#search-form'),
   searchInput = $<HTMLInputElement>('#search-input'),
   headerHomeLink = $<HTMLAnchorElement>('a.youtube-icon'),
   searchContainer = $<HTMLDivElement>('.search-container'),
   chooseFileButton = $<HTMLButtonElement>('#choose-file-button');

// Methods
const focusSearchBar = () => {
   searchInput.focus();
   addAttribute(searchContainer, 'has-focus');
};

const blurSearchBar = () => {
   searchInput.blur();
   removeAttribute(searchContainer, 'has-focus');
};

const handleSearchFormSubmit = (event: Event) => {
   event.preventDefault();

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

const setupTooltip = (button: HTMLElement) => {
   button.addEventListener('click', function () {
      button.setAttribute('data-tooltip', 'false');
      setTimeout(() => button.blur(), 400);
   });

   button.addEventListener('mouseenter', function () {
      if (button.getAttribute('data-tooltip') != 'true') {
         button.setAttribute('data-tooltip', 'true');
      }
   });
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

forEach(tooltipButtons, setupTooltip);
searchInput.addEventListener('keydown', (e) => e.code === 'Escape' && blurSearchBar());

// Hotkeys
registerHotkey({ eventCode: 'KeyC', handler: chooseFiles });
registerHotkey({ eventCode: 'Slash', handler: focusSearchBar });

export { header };
