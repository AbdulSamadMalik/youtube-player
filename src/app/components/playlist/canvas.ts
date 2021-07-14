import { createObjectURL, base64Id } from '../../utils/common';
import { formatDate, formatFilename, formatTime } from '../../utils/format';

const canvasRef = document.createElement('canvas'),
   ctx = canvasRef.getContext('2d')!;

const videoRef = document.createElement('video');
videoRef.muted = true;
videoRef.preload = 'auto';
ctx.fillStyle = '#000000';

const snapShot = async (width = 160, height = 90) => {
   videoRef.width = width;
   videoRef.height = height;

   let snapshotWidth;
   let snapshotHeight;

   if (videoRef.videoWidth > videoRef.videoHeight) {
      snapshotWidth = width;
      snapshotHeight = Math.round((videoRef.videoHeight / videoRef.videoWidth) * snapshotWidth);
   } else {
      snapshotHeight = height;
      snapshotWidth = Math.round((videoRef.videoWidth / videoRef.videoHeight) * snapshotHeight);
   }

   canvasRef.height = height;
   canvasRef.width = width;

   // clearing canvas before drawing new Image;
   ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);

   // drawing a black box on canvas
   ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

   // Positons for drawing
   const posX = width / 2 - snapshotWidth / 2;
   const posY = height / 2 - snapshotHeight / 2;

   //  drawing thumbnail on the canvas
   ctx.drawImage(videoRef, posX, posY, snapshotWidth, snapshotHeight);

   return canvasRef.toDataURL('image/jpg', 1);
};

export const newVideoDoc = (file: File): Promise<VideoDocument> => {
   return new Promise(async (resolve, reject) => {
      try {
         const blobURL = createObjectURL(file),
            videoId = base64Id(11);

         videoRef.oncanplaythrough = () => {
            if (!isNaN(videoRef.duration)) {
               videoRef.currentTime = Math.round(videoRef.duration / 2);
            }
         };

         videoRef.onseeked = async () => {
            const videoDoc: VideoDocument = {
               id: videoId,
               fileName: file.name,
               blobLocation: blobURL,
               duration: videoRef.duration,
               dateAsNumber: file.lastModified,
               thumbnails: {
                  small: await snapShot(104, 60),
               },
            };

            resolve(videoDoc);
         };

         videoRef.src = blobURL;
      } catch (error) {
         reject(error.message);
      }
   });
};
