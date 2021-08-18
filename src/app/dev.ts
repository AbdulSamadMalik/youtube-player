import { addVideosToPlaylist } from './layout/playlist';
import { initializePlayer } from './layout/player';

const Development = async () => {
   const videoNode = initializePlayer();
   const res = await fetch('/local/videos/2.mp4');
   const blob = await res.blob();

   // Global access
   window['videoNode'] = videoNode;

   await addVideosToPlaylist([
      new File([blob], 'Sample Video', {
         type: 'video/mp4',
         lastModified: Date.now(),
      }),
   ]);
};

export default Development;
