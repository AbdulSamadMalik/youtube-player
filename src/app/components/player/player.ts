import { $, conditionalAttribute, createObjectURL, isString } from '../../utils';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { chooseFiles } from '../filepicker';
import { initializeControls } from '../controls';
import { registerHotkey } from '../../hotkeys';
import { header } from '../header';
import { ajax, AjaxResponse } from 'rxjs/ajax';

const playerPlaceholder = $('#initial-player-container'),
   videoNode = $<HTMLVideoElement>('.html5-main-video'),
   videoPreview = $<HTMLVideoElement>('.video-preview#video'),
   videoPlayer = $('#video-player'),
   watchPage = $('.watch-page#watch-page');

const PlayerInitialized = new BehaviorSubject<boolean>(false),
   videoState = new BehaviorSubject<VideoState>('paused'),
   volumeState = new BehaviorSubject<VolumeState>('full'),
   isMiniplayer = new BehaviorSubject<boolean>(false);

export const initializePlayer = (): HTMLVideoElement => {
   if (!PlayerInitialized.value) {
      initializeControls();
      playerPlaceholder.parentElement?.removeChild(playerPlaceholder);
      PlayerInitialized.next(true);
   }
   return videoNode;
};

export const setVideoSource = (source: Blob | File | string): Promise<HTMLVideoElement> => {
   return new Promise((resolve, reject) => {
      if (source instanceof File || source instanceof Blob) {
         videoNode.src = createObjectURL(source);
         videoPreview.src = videoNode.src;
      } else if (isString(source)) {
         videoNode.src = source;
         videoPreview.src = source;
      } else {
         reject('Not a valid video source.');
      }

      resolve(videoNode);
   });
};

const toggleCinemaMode = () => {
   watchPage.toggleAttribute('cinema');
   videoPlayer.toggleAttribute('cinema');
};

const toggleFullScreen = async (isFullScreen: boolean) => {
   if (isFullScreen) return await document.exitFullscreen();
   return await document.body.requestFullscreen();
};

const toggleFullScreenMode = async () => {
   const isFullScreen = Boolean(document.fullscreenElement);

   toggleFullScreen(isFullScreen);
   conditionalAttribute(document.body, !isFullScreen, 'fullscreen');
   conditionalAttribute(watchPage, !isFullScreen, 'fullscreen');
   conditionalAttribute(videoPlayer, !isFullScreen, 'fullscreen');
   conditionalAttribute(header, !isFullScreen, 'hidden');
};

const changeVideoState = (state: VideoState) => () => {
   videoState.next(state);
};

playerPlaceholder.addEventListener('click', chooseFiles);

videoNode.addEventListener('play', changeVideoState('playing'));
videoNode.addEventListener('pause', changeVideoState('paused'));
videoNode.addEventListener('ended', changeVideoState('completed'));

// HotKeys
registerHotkey({ eventCode: 'KeyT', handler: toggleCinemaMode });
registerHotkey({ eventCode: 'KeyF', handler: toggleFullScreenMode });

export {
   videoNode,
   videoState,
   videoPlayer,
   videoPreview,
   volumeState,
   isMiniplayer,
   toggleCinemaMode,
   toggleFullScreenMode,
};
