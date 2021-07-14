import { filter, isEqual } from 'lodash-es';

interface Hotkey {
   eventCode: EventCode;
   shiftKey?: boolean;
   ctrlKey?: boolean;
   altKey?: boolean;
   metaKey?: boolean;
   handler(e: KeyboardEvent): void;
   /** Disable preventDefault on an Element */
   disableOn?: HTMLElement | null;
}

const registeredHotkeys: Hotkey[] = [];

export const registerHotkey = (hotkey: Hotkey) => {
   return registeredHotkeys.push(hotkey);
};

document.addEventListener('keydown', (ev: KeyboardEvent) => {
   const hotkeysInEvent = filter(registeredHotkeys, (key) => {
      return isEqual(key.eventCode, ev.code);
   });

   if (!hotkeysInEvent.length) {
      return;
   }

   hotkeysInEvent.forEach((hotkey) => {
      if (
         isEqual(ev.code, hotkey.eventCode) &&
         isEqual(ev.shiftKey, hotkey.shiftKey || false) &&
         isEqual(ev.ctrlKey, hotkey.ctrlKey || false) &&
         isEqual(ev.altKey, hotkey.altKey || false) &&
         isEqual(ev.metaKey, hotkey.metaKey || false)
      ) {
         if (hotkey.disableOn && isEqual(document.activeElement, hotkey.disableOn)) {
            hotkey.handler(ev);
            return;
         }

         ev.preventDefault();
         hotkey.handler(ev);
      }
   });
});
