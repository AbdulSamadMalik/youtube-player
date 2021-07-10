import { $, createObjectURL, isString } from '../../utils';
import { BehaviorSubject } from 'rxjs';
import { chooseFiles } from '../filepicker';
import { initializeControls } from '../controls';
import { registerHotkey } from '../../hotkeys';

const playerPlaceholder = $('#initial-player-container'),
   videoNode = $<HTMLVideoElement>('.html5-main-video'),
   videoPreview = $<HTMLVideoElement>('.video-preview#video'),
   videoPlayer = $('#video-player'),
   watchPage = $('.watch-page#watch-page');

const initialized = new BehaviorSubject<boolean>(false),
   videoState = new BehaviorSubject<VideoState>('paused'),
   volumeState = new BehaviorSubject<VolumeState>('full'),
   isMiniplayer = new BehaviorSubject<boolean>(false);

export const initializePlayer = (): HTMLVideoElement => {
   if (!initialized.value) {
      initializeControls();
      playerPlaceholder.parentElement?.removeChild(playerPlaceholder);
      initialized.next(true);
   }
   return videoNode;
};

export const setVideoSource = (source: Blob | File | string): Promise<HTMLVideoElement> => {
   return new Promise((resolve) => {
      if (source instanceof File || source instanceof Blob) {
         videoNode.src = createObjectURL(source);
         videoPreview.src = videoNode.src;
      } else if (isString(source)) {
         videoNode.src = source;
         videoPreview.src = source;
      } else {
         throw new Error('Not a valid video source.');
      }

      resolve(videoNode);
   });
};

const toggleCinemaMode = () => {
   watchPage.toggleAttribute('cinema');
   videoPlayer.toggleAttribute('cinema');
};

const changeVideoState = (state: VideoState) => () => {
   videoState.next(state);
};

registerHotkey({ eventCode: 'KeyT', handler: toggleCinemaMode });
playerPlaceholder.addEventListener('click', chooseFiles);

videoNode.addEventListener('play', changeVideoState('playing'));
videoNode.addEventListener('pause', changeVideoState('paused'));
videoNode.addEventListener('ended', changeVideoState('completed'));

export {
   videoNode,
   videoState,
   videoPlayer,
   videoPreview,
   volumeState,
   isMiniplayer,
   toggleCinemaMode,
};
