interface Hotkey {
   keyup?: boolean;
   altKey?: boolean;
   metaKey?: boolean;
   ctrlKey?: boolean;
   shiftKey?: boolean;
   eventCode: EventCode;
   handler?(e: KeyboardEvent): void;
}

const keydownHotkeys: Hotkey[] = [];
const keyUpHotkeys: Hotkey[] = [];

export const registerHotkey = (
   hotkey: Hotkey | EventCode,
   handler?: (e: KeyboardEvent) => void
) => {
   if (typeof hotkey === 'string') {
      return keydownHotkeys.push({
         eventCode: hotkey,
         handler: handler,
      });
   }
   if (hotkey.keyup === true) {
      return keyUpHotkeys.push(hotkey);
   }
   return keydownHotkeys.push(hotkey);
};

const handleKeyboardEvent = (event: KeyboardEvent, hotkeys: Hotkey[]) => {
   const hotkeysInEvent = hotkeys.filter((key) => key.eventCode === event.code);

   hotkeysInEvent.forEach((hotkey) => {
      if (document.activeElement?.tagName === 'INPUT') {
         return;
      }

      if (
         hotkey.handler &&
         event.code === hotkey.eventCode &&
         event.shiftKey === (hotkey.shiftKey || false) &&
         event.ctrlKey === (hotkey.ctrlKey || false) &&
         event.altKey === (hotkey.altKey || false) &&
         event.metaKey === (hotkey.metaKey || false)
      ) {
         event.preventDefault();
         hotkey.handler(event);
      }
   });
};

document.addEventListener('keydown', (event: KeyboardEvent) => {
   handleKeyboardEvent(event, keydownHotkeys);

   if (keyUpHotkeys.filter((key) => key.eventCode === event.code).length) {
      event.preventDefault();
   }
});

document.addEventListener('keyup', (event: KeyboardEvent) => {
   handleKeyboardEvent(event, keyUpHotkeys);
});
