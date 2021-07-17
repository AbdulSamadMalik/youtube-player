import { header } from '../header';
import { isString } from 'lodash-es';
import { BehaviorSubject } from 'rxjs';
import { chooseFiles } from '../dialogs';
import { registerHotkey } from '../../hotkeys';
import { hideControls, initializeControls, scrollButton, showControls } from '../controls';
import { $, conditionalAttribute, createObjectURL } from '../../utils';
import { formatDate, formatFilename, formatVideoViews } from '../../utils/format';

const initialScreen = $('#initial-player-container'),
   videoNode = $<HTMLVideoElement>('.html5-main-video'),
   videoPreview = $<HTMLVideoElement>('.video-preview#video'),
   videoPlayer = $('#video-player'),
   watchPage = $('.watch-page#watch-page'),
   videoTitle = $('.video-info#video-title'),
   videoDate = $('.video-info#video-date'),
   videoViewCount = $('.video-info#count');

const isInitialized = new BehaviorSubject<boolean>(false),
   videoState = new BehaviorSubject<VideoState>('paused'),
   volumeState = new BehaviorSubject<VolumeState>('full'),
   isMiniplayer = new BehaviorSubject<boolean>(false);

export const initializePlayer = (): HTMLVideoElement => {
   if (!isInitialized.value) {
      initializeControls();
      isInitialized.next(true);
      initialScreen.parentElement?.removeChild(initialScreen);

      videoPlayer.addEventListener('mousemove', () => showControls());
      videoPlayer.addEventListener('mouseleave', () => hideControls());
      videoNode.addEventListener('play', () => showControls());
   }
   return videoNode;
};

export const setVideoSource = (videoInput: VideoInput): Promise<HTMLVideoElement> => {
   return new Promise((resolve, reject) => {
      const setSource = (src: string) => {
         videoNode.src = src;
         videoPreview.src = src;

         if (videoInput.fileName) {
            const baseTitle = 'YouTube Video Player',
               title = formatFilename(videoInput.fileName);
            document.title = `${title} - ${baseTitle}`;
            videoTitle.innerHTML = title;
         }

         if (videoInput.lastModified) {
            videoDate.innerHTML = formatDate(videoInput.lastModified);
         }

         if (videoInput.views) {
            videoViewCount.innerHTML = formatVideoViews(videoInput.views);
         }
      };

      if (videoInput.source instanceof File || videoInput.source instanceof Blob) {
         setSource(createObjectURL(videoInput.source));
      } else if (isString(videoInput.source)) {
         setSource(videoInput.source);
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

const toggleFullScreenMode = () => {
   if (Boolean(document.fullscreenElement)) return document.exitFullscreen();
   return document.body.requestFullscreen();
};

const onFullScreenChange = () => {
   const isFullScreen = Boolean(document.fullscreenElement ?? document.fullscreen);

   conditionalAttribute(scrollButton, isFullScreen, 'show');
   conditionalAttribute(header, isFullScreen, 'hide');
   conditionalAttribute(watchPage, isFullScreen, 'fullscreen');
   conditionalAttribute(videoPlayer, isFullScreen, 'fullscreen');
   conditionalAttribute(document.body, isFullScreen, 'fullscreen');
};

const toggleMiniPlayerMode = () => {
   if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
   } else if (document.pictureInPictureEnabled) {
      videoNode.requestPictureInPicture();
   } else {
      alert("Your Browser doesn't support this feature.");
   }
};

const changeVideoState = (state: VideoState) => () => videoState.next(state);

initialScreen.addEventListener('click', chooseFiles);
document.body.addEventListener('fullscreenchange', onFullScreenChange);

videoNode.addEventListener('play', changeVideoState('playing'));
videoNode.addEventListener('pause', changeVideoState('paused'));
videoNode.addEventListener('ended', changeVideoState('completed'));

// HotKeys
registerHotkey({ eventCode: 'KeyT', handler: toggleCinemaMode });
registerHotkey({ eventCode: 'KeyF', handler: toggleFullScreenMode });
registerHotkey({ eventCode: 'KeyI', handler: toggleMiniPlayerMode });

export {
   videoNode,
   videoState,
   videoPlayer,
   videoPreview,
   volumeState,
   isMiniplayer,
   toggleCinemaMode,
   toggleFullScreenMode,
   toggleMiniPlayerMode,
};
