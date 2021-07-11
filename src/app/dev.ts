import { addVideosToPlaylist } from './components/playlist';
import { initializePlayer } from './components/player';
import { setVideoSource, videoNode } from './components/player';

// const videoNames = ['1.mp4', '2.mp4'];
const videoNames = ['link2.mp4'];

export const addToWindow = (prop: any, value: any) => {
   window[prop] = value;
};

const Development = async () => {
   // for (let i = 0; i < videoNames.length; i++) {
   //    await fetch('videos/' + videoNames[i])
   //       .then((r) => r.blob())
   //       .then((blob) => {
   //          const file = new File([blob], videoNames[i], {
   //             type: 'video/mp4',
   //          });
   //          addVideosToPlaylist([file]);
   //       });
   // }
   initializePlayer();
   // videoNode.src = '/videos/link2.mp4';
   setVideoSource('/local/videos/disney.mp4');
   // videoNode.autoplay = true;
   addToWindow('video', videoNode);
   videoNode.volume = 0;
};

export default Development;
