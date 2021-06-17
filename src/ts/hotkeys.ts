import { areEqual } from './utils';
import { EventCode } from '../models/keycode.model';
import { filter } from 'lodash-es';

interface Hotkey {
  eventCode: EventCode;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler(e: KeyboardEvent): void;
  /** Disables the preventDefault on some Element */
  disableOn?: HTMLElement | null;
}

const registeredHotkeys: Hotkey[] = [];

export const registerHotkey = (hotkey: Hotkey) => {
  return registeredHotkeys.push(hotkey);
};

document.addEventListener('keydown', (ev: KeyboardEvent) => {
  const hotkeysInEvent = filter(registeredHotkeys, (key) => {
    return areEqual(key.eventCode, ev.code);
  });

  if (!hotkeysInEvent.length) {
    return;
  }

  hotkeysInEvent.forEach((hotkey) => {
    if (
      areEqual(ev.code, hotkey.eventCode) &&
      areEqual(ev.shiftKey, hotkey.shiftKey ?? false) &&
      areEqual(ev.ctrlKey, hotkey.ctrlKey ?? false) &&
      areEqual(ev.altKey, hotkey.altKey ?? false) &&
      areEqual(ev.metaKey, hotkey.metaKey ?? false)
    ) {
      if (hotkey.disableOn && areEqual(document.activeElement, hotkey.disableOn)) {
        hotkey.handler(ev);
        return;
      }

      ev.preventDefault();
      hotkey.handler(ev);
    }
  });
});

export default { registerHotkey };
