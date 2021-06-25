import { random } from 'lodash-es';
import { setVideoSource } from '../components/player';

const randomVideo = () => {
   const videos = ['1.mp4', '2.mp4'];
   const url = `videos/${videos[random(0, videos.length - 1, false)]}`;
   return url;
};

const Development = () => {
   setVideoSource(randomVideo()).then((video) => {
      video.volume = 0.1;
   });
};

export default Development;
