import { Select, addAttribute, createObjectURL, isString, type } from '../../utils';
import { chooseFiles } from '../filepicker';
import './player.css';

const initialPlayerContainer = Select('#initial-player-container'),
   videoNode = Select<HTMLVideoElement>('.html5-main-video');

const hideInitialPlayer = () => {
   addAttribute(initialPlayerContainer, 'hidden');
};

export const setVideoSource = async (source: Blob | File | string) => {
   hideInitialPlayer();
   videoNode.controls = true;
   videoNode.autoplay = true;

   if (source instanceof File || source instanceof Blob) {
      videoNode.src = createObjectURL(source);
   } else if (isString(source)) {
      videoNode.src = source;
   } else {
      throw new Error('Not a valid video source.');
   }

   return videoNode;
};

initialPlayerContainer.addEventListener('click', chooseFiles);
