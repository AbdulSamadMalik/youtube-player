import { Select, addAttribute, createObjectURL, isString } from '../../utils';
import { chooseFiles } from '../filepicker';
import './player.css';

const playerPlaceholder = Select('#initial-player-container'),
   videoNode = Select<HTMLVideoElement>('.html5-main-video');

export const initializePlayer = (): HTMLVideoElement => {
   addAttribute(playerPlaceholder, 'hidden');
   return videoNode;
};

export const setVideoSource = (source: Blob | File | string): Promise<HTMLVideoElement> => {
   return new Promise((resolve) => {
      if (source instanceof File || source instanceof Blob) {
         videoNode.src = createObjectURL(source);
      } else if (isString(source)) {
         videoNode.src = source;
      } else {
         throw new Error('Not a valid video source.');
      }

      resolve(videoNode);
   });
};

playerPlaceholder.addEventListener('click', chooseFiles);
