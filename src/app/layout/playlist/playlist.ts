import { createObjectURL } from '../../utils';
import { $, addAttribute, removeAttribute } from '../../utils/dom';
import { formatFilename, formatTime, megabyte, str } from '../../utils/format';
import { chooseFiles } from '../dialogs';
import { initializePlayer, setVideoSource } from '../player';
import { newVideoDoc } from './canvas';
import {
   getVideoDoc,
   getVideoTime,
   getVideoViews,
   saveVideoDoc,
   updateVideoViews,
} from './storage';

let playerInitialized: boolean,
   viewUpdateHandle: number,
   currentListItem: HTMLElement,
   currentVideoFileName: string,
   switchingVideo: boolean,
   videoNode: HTMLVideoElement;

const supportedFileTypes = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime'],
   fileNames: Array<string> = [],
   videoDocs: Array<VideoDocument> = [];

const totalCount = $('#playlist-item-count'),
   listItemsContainer = $('#playlist-panel-items'),
   currentListItemIndex = $('#current-playlist-item'),
   addToPlayListButton = $('#add-to-playlist'),
   videoTileTemplate = $('template#playlist-tile');

const removePlaceholder = () => {
   const placeholder = document.querySelector('#playlist-placeholder');
   placeholder && placeholder.parentElement!.removeChild(placeholder);
};

const changeVideo = async (videoDoc: VideoDocument, playListItemElement: HTMLElement) => {
   if (currentVideoFileName && currentVideoFileName === videoDoc.fileName) {
      return;
   }

   switchingVideo = true;
   videoNode.pause();
   videoNode.currentTime = 0;

   currentVideoFileName = videoDoc.fileName;

   viewUpdateHandle && clearTimeout(viewUpdateHandle);
   currentListItem && removeAttribute(currentListItem, 'active');

   if (playListItemElement) {
      const currentIdx = videoDocs.findIndex((doc) => doc.fileName === videoDoc.fileName);
      currentListItemIndex.innerHTML = str(currentIdx + 1);
      addAttribute(playListItemElement, 'active');
      currentListItem = playListItemElement;
   }

   const storedTime = await getVideoTime(videoDoc.fileName);
   const storedViews = await getVideoViews(videoDoc.fileName);

   await setVideoSource({
      views: storedViews,
      title: videoDoc.fileName,
      startAt: storedTime,
      source: videoDoc.blobLocation,
      lastModified: videoDoc.dateAsNumber,
   });

   videoNode.autoplay = true;
   window.scrollTo(0, 0);
   switchingVideo = false;
   // Wait 10s before updating video views
   viewUpdateHandle = setTimeout(updateVideoViews, 10000, videoDoc.fileName);
};

const newVideoTile = (videoDoc: VideoDocument): HTMLElement => {
   const newVideoTile = document.createElement('video-tile');
   newVideoTile.innerHTML = videoTileTemplate.innerHTML;
   newVideoTile.id = 'video-tile';

   const videoAnchor = newVideoTile.querySelector('a')!;
   videoAnchor.href = `/watch?v=${videoDoc.id}`;
   videoAnchor.id = 'video-link';

   const thumbnail = videoAnchor.querySelector('img')!;
   thumbnail.src = videoDoc.thumbnails.small;

   const duration = videoAnchor.querySelector('#duration')!;
   duration.innerHTML = formatTime(videoDoc.duration, 2, 2);

   const title = videoAnchor.querySelector('#video-title')!;
   title.innerHTML = formatFilename(videoDoc.fileName);
   title.setAttribute('title', title.innerHTML);

   listItemsContainer.appendChild(newVideoTile);

   videoAnchor.addEventListener('click', (ev) => {
      ev.preventDefault();
      changeVideo(videoDoc, newVideoTile);
   });

   return newVideoTile;
};

async function _getVideoDoc(file: File): Promise<VideoDocument> {
   const storedDoc = await getVideoDoc(file.name);
   if (storedDoc) return Object.assign({}, storedDoc, { blobLocation: createObjectURL(file) });

   const newDoc = await newVideoDoc(file);
   saveVideoDoc(file.name, newDoc);
   return newDoc;
}

const addVideoToPlaylist = async (file: File) => {
   const videoDoc = await _getVideoDoc(file);
   const videoTile = newVideoTile(videoDoc);
   fileNames.push(file.name);
   videoDocs.push(videoDoc);
   totalCount.innerHTML = videoDocs.length.toString();

   if (!playerInitialized) {
      removePlaceholder();
      videoNode = initializePlayer();
      changeVideo(videoDoc, videoTile);
      playerInitialized = true;
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

addToPlayListButton.addEventListener('click', () => chooseFiles());
