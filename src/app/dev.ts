import { addVideosToPlaylist } from './layout/playlist';
import { initializePlayer } from './layout/player';

const Development = async () => {
   const videoNode = initializePlayer();
   const res = await fetch('/local/videos/2.mp4');
   const blob = await res.blob();

   // Global access
   window['videoNode'] = videoNode;

   // videoNode.volume = 0;

   await addVideosToPlaylist([
      new File([blob], 'Sample Video', {
         type: 'video/mp4',
         lastModified: Date.now(),
      }),
   ]);

   videoNode.pause();
};

export default Development;
