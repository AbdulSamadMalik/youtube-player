import { chooseFiles } from '../dialogs/filePicker';
import { registerHotkey } from '../../hotkeys';
import { preventAnchorReload } from '../../utils/common';
import { $, $$, addAttribute, removeAttribute } from '../../utils/dom';

// Refs
const header = $('header.header'),
   countryCode = $('.country-code'),
   tooltipButtons = $$('.header [data-tooltip]'),
   searchForm = $<HTMLFormElement>('#search-form'),
   searchInput = $<HTMLInputElement>('#search-input'),
   headerHomeLink = $<HTMLAnchorElement>('a.youtube-icon'),
   searchContainer = $<HTMLDivElement>('.search-container'),
   chooseFileButton = $<HTMLButtonElement>('#choose-file-button');

const COUNTRY_CODE_STORE = 'COUNTRY_CODE';
const DEFAULT_COUNTRY_CODE = 'IN';

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

const getCountryCode = async (): Promise<string> => {
   try {
      const storedCountryCode = localStorage.getItem(COUNTRY_CODE_STORE);

      if (storedCountryCode != null) return storedCountryCode;

      const res = await fetch('https://ipinfo.io/?token=e7f553952c3125');

      if (!res.ok) {
         localStorage.setItem(COUNTRY_CODE_STORE, DEFAULT_COUNTRY_CODE);
         return DEFAULT_COUNTRY_CODE;
      }

      const data: IpInfo = await res.json();
      localStorage.setItem(COUNTRY_CODE_STORE, data.country);
      return data.country;
   } catch (error) {
      return DEFAULT_COUNTRY_CODE;
   }
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
document.addEventListener('DOMContentLoaded', async () => {
   countryCode.innerHTML = await getCountryCode();
});

searchInput.addEventListener('focus', focusSearchBar);
searchInput.addEventListener('blur', blurSearchBar);
headerHomeLink.addEventListener('click', preventAnchorReload);
searchForm.addEventListener('submit', handleSearchFormSubmit);
chooseFileButton.addEventListener('click', chooseFiles);

searchInput.addEventListener('keydown', (e) => e.code === 'Escape' && blurSearchBar());
tooltipButtons.forEach(setupTooltip);

// Hotkeys
registerHotkey({ eventCode: 'KeyC', handler: chooseFiles });
registerHotkey({ eventCode: 'Slash', handler: focusSearchBar });

export { header };
