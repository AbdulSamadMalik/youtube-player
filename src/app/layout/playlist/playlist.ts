import { newVideoDoc } from './canvas';
import { chooseFiles } from '../dialogs';
import { initializePlayer, setVideoSource } from '../player';
import { $, addAttribute, removeAttribute } from '../../utils/dom';
import { formatTime, formatFilename, megabyte, str } from '../../utils/format';

let currentVideoId: string,
   playerInitialized: boolean,
   currentListItem: HTMLElement,
   currentVideoFileName: string,
   switchingVideo: boolean,
   videoNode: HTMLVideoElement;

const supportedFileTypes = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime'],
   allFileNames: Array<string> = [],
   videoDocs: Array<VideoDocument> = [];

const listItemCount = $('#playlist-item-count'),
   listItemsContainer = $('#playlist-panel-items'),
   currentListItemIndex = $('#current-playlist-item'),
   addToPlayListButton = $('#add-to-playlist'),
   videoTileTemplate = $('template#playlist-tile');

const removePlaceholder = () => {
   const placeholder = document.querySelector('#playlist-placeholder');
   placeholder && placeholder.parentElement!.removeChild(placeholder);
};

const changeVideo = async (videoDoc: VideoDocument, playListItemElement: HTMLElement) => {
   if (currentVideoId && currentVideoId === videoDoc.id) {
      return;
   }

   switchingVideo = true;
   videoNode.pause();
   videoNode.currentTime = 0;

   currentVideoFileName = videoDoc.fileName;

   currentListItem && removeAttribute(currentListItem, 'active');

   if (playListItemElement) {
      const currentIdx = videoDocs.findIndex((doc) => doc.fileName === videoDoc.fileName);
      currentListItemIndex.innerHTML = str(currentIdx + 1);
      currentListItem = playListItemElement;
      addAttribute(playListItemElement, 'active');
   }

   setVideoSource({
      source: videoDoc.blobLocation,
      lastModified: videoDoc.dateAsNumber,
      fileName: videoDoc.fileName,
   });

   window.scrollTo(0, 0);
   videoNode.autoplay = true;
   switchingVideo = false;
};

const appendVideoTile = (videoDoc: VideoDocument) => {
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

const addVideoToPlaylist = async (file: File) => {
   const videoDoc = await newVideoDoc(file);
   const newVideoTile = appendVideoTile(videoDoc);
   allFileNames.push(file.name);
   videoDocs.push(videoDoc);
   listItemCount.innerHTML = videoDocs.length.toString();

   if (!playerInitialized) {
      removePlaceholder();
      videoNode = initializePlayer();
      changeVideo(videoDoc, newVideoTile);
      playerInitialized = true;
   }
};

export const addVideosToPlaylist = async (files: File[]) => {
   if (!files.length) {
      return;
   }

   let alertMessage;

   const supportedFiles = Array.from(files).filter((file) => {
      if (supportedFileTypes.includes(file.type)) {
         if (file.size >= megabyte(1)) {
            return true;
         }
         alertMessage = 'Please choose a file greater than 1MB';
         return false;
      }
      alertMessage = 'Please choose mp4, mkv or avi file formats';
      return false;
   });

   if (!supportedFiles.length) {
      alert(alertMessage);
   }

   const uniqueFiles: Array<File> = [];

   supportedFiles.forEach((file) => {
      if (!allFileNames.includes(file.name)) {
         uniqueFiles.push(file);
      }
   });

   for (let index = 0; index < uniqueFiles.length; index++) {
      await addVideoToPlaylist(uniqueFiles[index]);
   }
};

addToPlayListButton.addEventListener('click', () => chooseFiles());
