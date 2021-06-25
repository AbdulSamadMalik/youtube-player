import { addVideosToPlaylist } from '../components/playlist';

const videoNames = ['1.mp4', '2.mp4'];

const Development = async () => {
   for (let i = 0; i < videoNames.length; i++) {
      console.log(videoNames[i]);
      await fetch('videos/' + videoNames[i])
         .then((r) => r.blob())
         .then((blob) => {
            const file = new File([blob], videoNames[i], {
               type: 'video/mp4',
            });
            addVideosToPlaylist([file]);
         });
   }
};

export default Development;
