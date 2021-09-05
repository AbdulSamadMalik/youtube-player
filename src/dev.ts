import { addVideosToPlaylist } from './lib/playlist';
import { initializePlayer } from './lib/player';

const dev = async () => {
   const videoNode = initializePlayer();
   const res = await fetch('/local/videos/4.mp4');
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

export default dev;
