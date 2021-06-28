import { $, addAttribute, createObjectURL, isString } from '../../utils';
import { BehaviorSubject } from 'rxjs';
import { chooseFiles } from '../filepicker';
import { initializeControls } from '../controls';

const playerPlaceholder = $('#initial-player-container'),
   videoNode = $<HTMLVideoElement>('.html5-main-video'),
   videoPreview = $<HTMLVideoElement>('.video-preview#video'),
   videoPlayer = $('video-player');

const initialized = new BehaviorSubject<boolean>(false),
   videoState = new BehaviorSubject<VideoState>('paused');

export const initializePlayer = (): HTMLVideoElement => {
   if (!initialized.value) {
      initializeControls();
      addAttribute(playerPlaceholder, 'hidden');
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

videoNode.addEventListener('play', () => videoState.next('playing'));
videoNode.addEventListener('pause', () => videoState.next('paused'));
videoNode.addEventListener('ended', () => videoState.next('completed'));

playerPlaceholder.addEventListener('click', chooseFiles);

export { videoNode, videoState, videoPlayer, videoPreview };
