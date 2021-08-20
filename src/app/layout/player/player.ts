import { BehaviorSubject } from 'rxjs';
import { registerHotkey } from '../../hotkeys';
import { $, conditionalAttribute, createObjectURL } from '../../utils';
import { formatDate, formatFileName, formatVideoViews } from '../../utils/format';
import { hideControls, initializeControls, scrollButton, showControls } from '../controls';
import { chooseFiles } from '../dialogs/filePicker';
import { header } from '../header';

const initialScreen = $('#initial-player-container'),
   videoPlayer = $('#video-player'),
   watchPage = $('.watch-page#watch-page'),
   videoTitle = $('.video-info#video-title'),
   videoDate = $('.video-info#video-date'),
   videoViewCount = $('.video-info#count'),
   videoNode = $('.html5-main-video') as HTMLVideoElement,
   videoPreview = $('.video-preview#video') as HTMLVideoElement;

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

export const setVideoSource = ({
   views,
   title,
   startAt,
   source,
   lastModified,
}: VideoInput): Promise<HTMLVideoElement> => {
   return new Promise((resolve, reject) => {
      const _setVideoSource = (src: string) => {
         videoNode.src = src;
         videoPreview.src = src;

         const base = 'YouTube Video Player';
         title = formatFileName(title);
         document.title = `${title} - ${base}`;
         videoTitle.innerHTML = title;

         videoDate.innerHTML = formatDate(lastModified || Date.now());
         videoNode.currentTime = startAt || 0;
         videoViewCount.innerHTML = formatVideoViews(views || 0);
      };

      if (source instanceof File || source instanceof Blob) {
         _setVideoSource(createObjectURL(source));
      } else if ('string' == typeof source) {
         _setVideoSource(source);
      } else {
         reject('Invalid video source.');
      }
      resolve(videoNode);
   });
};

const toggleCinemaMode = () => {
   conditionalAttribute(videoPlayer, watchPage.toggleAttribute('cinema'), 'cinema');
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
