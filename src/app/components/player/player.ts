import { $, addAttribute, createObjectURL } from '../../core/utils';
import { chooseFiles } from '../filepicker';

const initialPlayerContainer = $('#initial-player-container'),
   videoNode = $<HTMLVideoElement>('.html5-main-video');

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
