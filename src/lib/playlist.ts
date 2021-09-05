import { $ } from '../utils/dom';
import { createObjectURL, generateFileId } from '../utils';
import { formatFileName, formatTime, megabyte, str } from '../utils/format';
import { chooseFiles } from './choose';
import { initializePlayer, setVideoSource } from './player';
import { newVideoDoc } from '../helpers/canvas';
import {
   getVideoDoc,
   getVideoTime,
   getVideoViews,
   saveVideoDoc,
   saveVideoTime,
   updateVideoViews,
} from './storage';
import '../styles/playlist.scss';

let playerInitialized: boolean,
   viewUpdateHandle: number,
   currentListItem: HTMLElement,
   currentVideoFileId: string,
   switchingVideo: boolean,
   videoNode: HTMLVideoElement;

const supportedFileTypes = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime'],
   fileNames: Array<string> = [],
   videoDocs: Array<VideoDoc> = [];

const totalCount = $('#playlist-item-count'),
   listItemsContainer = $('#playlist-panel-items'),
   currentListItemIndex = $('#current-playlist-item'),
   addToPlayListButton = $('#add-to-playlist'),
   videoTileTemplate = $('template#playlist-tile');

const removePlaceholder = () => {
   const placeholder = document.querySelector('#playlist-placeholder');
   placeholder && placeholder.parentElement!.removeChild(placeholder);
};

const changeVideo = async (videoDoc: VideoDoc, playListItemElement: HTMLElement) => {
   if (currentVideoFileId === videoDoc.fileId || switchingVideo) {
      return;
   }

   switchingVideo = true;
   videoNode.pause();
   videoNode.currentTime = 0;

   currentVideoFileId = videoDoc.fileId;

   viewUpdateHandle && clearTimeout(viewUpdateHandle);
   currentListItem && currentListItem.removeAttribute('active');

   if (playListItemElement) {
      const currentIdx = videoDocs.findIndex((doc) => doc.fileId === videoDoc.fileId);
      currentListItemIndex.innerHTML = str(currentIdx + 1);
      playListItemElement.setAttribute('active', 'true');
      currentListItem = playListItemElement;
   }

   const storedTime = await getVideoTime(videoDoc.fileId);
   const storedViews = await getVideoViews(videoDoc.fileId);

   await setVideoSource({
      views: storedViews,
      title: videoDoc.fileName,
      source: videoDoc.blobURL,
      lastModified: videoDoc.date,
      startAt: (duration) => {
         console.log(storedTime, duration, storedTime <= duration * 0.95);
         return storedTime <= duration * 0.95 ? storedTime : 0;
      },
   });

   videoNode.autoplay = true;
   switchingVideo = false;

   window.scrollTo(0, 0);
   document.body.scrollTo(0, 0);

   // Wait 10s before updating video views
   viewUpdateHandle = setTimeout(updateVideoViews, 10000, videoDoc.fileId);
};

const newVideoTile = (videoDoc: VideoDoc) => {
   const newVideoTile = document.createElement('div');
   newVideoTile.innerHTML = videoTileTemplate.innerHTML;
   newVideoTile.id = 'video-tile';

   const container = newVideoTile.querySelector('#container')!;

   const thumbnail = container.querySelector('img')!;
   thumbnail.src = videoDoc.thumbnail.dataURL;

   const duration = container.querySelector('#duration')!;
   duration.innerHTML = formatTime(videoDoc.duration, 1, 2);

   const title = container.querySelector('#video-title')!;
   title.innerHTML = formatFileName(videoDoc.fileName);
   title.setAttribute('title', title.innerHTML);

   listItemsContainer.appendChild(newVideoTile);

   newVideoTile.addEventListener('click', () => changeVideo(videoDoc, newVideoTile));

   return newVideoTile;
};

async function _getVideoDoc(file: File): Promise<VideoDoc | null> {
   const fileId = generateFileId(file);
   const storedDoc = await getVideoDoc(fileId);
   if (storedDoc)
      return Object.assign<VideoDoc, Partial<VideoDoc>>(storedDoc, {
         blobURL: createObjectURL(file),
      });

   const newDoc = await newVideoDoc(file);
   newDoc && saveVideoDoc(fileId, newDoc);
   return newDoc;
}

const addVideoToPlaylist = async (file: File) => {
   const videoDoc = await _getVideoDoc(file);

   if (!videoDoc) return;

   const videoTile = newVideoTile(videoDoc);
   fileNames.push(file.name);
   videoDocs.push(videoDoc);
   totalCount.innerHTML = videoDocs.length.toString();

   if (!playerInitialized) {
      removePlaceholder();
      videoNode = initializePlayer();
      changeVideo(videoDoc, videoTile);
      playerInitialized = true;

      setInterval(() => {
         if (!currentVideoFileId || !videoNode) return;
         let currentTime = videoNode.currentTime;
         // Don't save time if current time is greater than 95% video length
         if (currentTime >= videoNode.duration * 0.95) currentTime = 0;

         if (!videoNode.ended && !videoNode.paused) {
            saveVideoTime(currentVideoFileId, videoNode.currentTime);
         }
      }, 1000);
   }
};

export const addVideosToPlaylist = async (files: File[]) => {
   if (!files.length) {
      return;
   }

   let alertMessage = '';

   const supportedFiles = Array.from(files).filter((file) => {
      if (supportedFileTypes.includes(file.type)) {
         if (file.size >= megabyte(1)) {
            return true;
         }
         alertMessage = 'Please choose a file greater than 1MB';
         return false;
      }
      alertMessage += 'Please choose mp4, mkv or avi video formats';
      return false;
   });

   if (!supportedFiles.length) {
      alert(alertMessage);
   }

   const uniqueFiles: File[] = [];

   supportedFiles.forEach((file) => {
      if (!fileNames.includes(file.name)) {
         uniqueFiles.push(file);
      }
   });

   for (const uniqueFile of uniqueFiles) {
      await addVideoToPlaylist(uniqueFile);
   }
};

addToPlayListButton.addEventListener('click', chooseFiles);
