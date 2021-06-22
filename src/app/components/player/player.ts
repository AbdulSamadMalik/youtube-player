import { Select, addAttribute, createObjectURL } from '../../core/utils';
import { chooseFiles } from '../filepicker';

const initialPlayerContainer = Select('#initial-player-container'),
   videoNode = Select<HTMLVideoElement>('.html5-main-video');

const hideInitialPlayer = () => {
   addAttribute(initialPlayerContainer, 'hidden');
};

export const playVideo = (file: Blob | File) => {
   hideInitialPlayer();
   videoNode.controls = true;
   videoNode.autoplay = true;
   videoNode.src = createObjectURL(file);
};

initialPlayerContainer.addEventListener('click', chooseFiles);
