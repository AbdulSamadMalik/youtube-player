// Type definitions for non-npm package Media Session API 1.1
// Project: https://wicg.github.io/mediasession/
// Definitions by: Julien CROUZET <https://github.com/jucrouzet>
//                 Eana Hufwe <https://github.com/blueset>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface Navigator {
   readonly mediaSession?: MediaSession;
}

interface Window {
   MediaSession?: MediaSession;
   [key: string]: any;
}

type MediaSessionPlaybackState = 'none' | 'paused' | 'playing';

type MediaSessionAction =
   | 'play'
   | 'pause'
   | 'seekbackward'
   | 'seekforward'
   | 'seekto'
   | 'previoustrack'
   | 'nexttrack'
   | 'skipad'
   | 'stop';

interface SetPositionState {
   (playbackState?: MediaPositionState): void;
}

interface MediaSession {
   // Current media session playback state.
   playbackState: MediaSessionPlaybackState;
   // Current media session meta data.
   metadata: MediaMetadata | null;

   // Set/Unset actions handlers.
   setActionHandler(
      action: 'seekto',
      listener:
         | ((
              details: Required<Pick<MediaSessionActionDetails, 'seekTime'>> &
                 MediaSessionActionDetails
           ) => void)
         | null
   ): void;
   setActionHandler(
      action: MediaSessionAction,
      listener: ((details: MediaSessionActionDetails) => void) | null
   ): void;

   // Set/unset position state
   setPositionState?: SetPositionState;
}

interface MediaImage {
   // URL from which the user agent can fetch the image’s data.
   src: string;
   // Specify the MediaImage object’s sizes. It follows the spec of sizes attribute in HTML link element.
   sizes?: string;
   // A hint as to the media type of the image.
   type?: string;
}

interface MediaMetadataInit {
   // Media's title.
   title?: string;
   // Media's artist.
   artist?: string;
   // Media's album.
   album?: string;
   // Media's artwork.
   artwork?: MediaImage[];
}

declare class MediaMetadata {
   constructor(init?: MediaMetadataInit);
   // Media's title.
   title: string;
   // Media's artist.
   artist: string;
   // Media's album.
   album: string;
   // Media's artwork.
   artwork: ReadonlyArray<MediaImage>;
}

interface MediaPositionState {
   // Duration of media in seconds
   duration?: number;

   // Playback rate of media, positive for forward playback, negative for backward playback. This number should not be zero
   playbackRate?: number;

   // Last reported playback position in seconds, should be positive.
   position?: number;
}

interface MediaSessionActionDetails {
   // The action that the handler is associated with
   action: MediaSessionAction;

   // This MAY be provided when the action is seekbackward or seekforward. Stores number of seconds to move the playback time by.
   seekOffset?: number;

   // MUST be provided when action is seekto. Stores the time in seconds to move the playback time to.
   seekTime?: number;

   // MAY be provided when action is seekto. Stores true if the action is being called multiple times as part of a sequence and this is not the last call in that sequence.
   fastSeek?: boolean;
}

declare type EventCode =
   | 'Backspace'
   | 'Tab'
   | 'Enter'
   | 'ShiftLeft'
   | 'ShiftRight'
   | 'ControlLeft'
   | 'ControlRight'
   | 'AltLeft'
   | 'AltRight'
   | 'Pause'
   | 'CapsLock'
   | 'Escape'
   | 'Space'
   | 'PageUp'
   | 'PageDown'
   | 'End'
   | 'Home'
   | 'ArrowLeft'
   | 'ArrowUp'
   | 'ArrowRight'
   | 'ArrowDown'
   | 'PrintScreen'
   | 'Insert'
   | 'Delete'
   | 'Digit0'
   | 'Digit1'
   | 'Digit2'
   | 'Digit3'
   | 'Digit4'
   | 'Digit5'
   | 'Digit6'
   | 'Digit7'
   | 'Digit8'
   | 'Digit9'
   | 'KeyA'
   | 'KeyB'
   | 'KeyC'
   | 'KeyD'
   | 'KeyE'
   | 'KeyF'
   | 'KeyG'
   | 'KeyH'
   | 'KeyI'
   | 'KeyJ'
   | 'KeyK'
   | 'KeyL'
   | 'KeyM'
   | 'KeyN'
   | 'KeyO'
   | 'KeyP'
   | 'KeyQ'
   | 'KeyR'
   | 'KeyS'
   | 'KeyT'
   | 'KeyU'
   | 'KeyV'
   | 'KeyW'
   | 'KeyX'
   | 'KeyY'
   | 'KeyZ'
   | 'MetaLeft'
   | 'MetaRight'
   | 'ContextMenu'
   | 'Numpad0'
   | 'Numpad1'
   | 'Numpad2'
   | 'Numpad3'
   | 'Numpad4'
   | 'Numpad5'
   | 'Numpad6'
   | 'Numpad7'
   | 'Numpad8'
   | 'Numpad9'
   | 'NumpadMultiply'
   | 'NumpadAdd'
   | 'NumpadSubtract'
   | 'NumpadDecimal'
   | 'NumpadDivide'
   | 'F1'
   | 'F2'
   | 'F3'
   | 'F4'
   | 'F5'
   | 'F6'
   | 'F7'
   | 'F8'
   | 'F9'
   | 'F10'
   | 'F11'
   | 'F12'
   | 'NumLock'
   | 'ScrollLock'
   | 'Semicolon'
   | 'Equal'
   | 'Comma'
   | 'Minus'
   | 'Period'
   | 'Slash'
   | 'Backquote'
   | 'BracketLeft'
   | 'Backslash'
   | 'BracketRight'
   | 'Quote';

declare type ImageType = 'image/png' | 'image/webp' | 'image/jpeg';

// Decrations for picture in picture mode

interface PictureInPictureWindow {
   readonly width: number;
   readonly height: number;
   onresize(this: PictureInPictureWindow, ev: any): void;
   addEventListener(
      type: 'resize',
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
   ): void;
   removeEventListener(
      type: 'resize',
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
   ): void;
}

interface PictureInPictureEvent extends Event {
   readonly pictureInPictureWindow: PictureInPictureWindow;
}

type PictureInPictureEventListener =
   | ((this: HTMLVideoElement, ev: PictureInPictureEvent) => any)
   | null;

interface HTMLVideoElement {
   autoPictureInPicture: boolean;
   disablePictureInPicture: boolean;
   requestPictureInPicture(): Promise<PictureInPictureWindow>;
   onenterpictureinpicture: PictureInPictureEventListener;
   onleavepictureinpicture: PictureInPictureEventListener;
}

interface Document {
   readonly pictureInPictureEnabled: boolean;
   exitPictureInPicture(): Promise<void>;
}

interface DocumentOrShadowRoot {
   readonly pictureInPictureElement: HTMLVideoElement | null;
}

interface Array<T> {
   get first(): T | null;
   get last(): T | null;
}
