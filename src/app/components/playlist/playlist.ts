import { newVideoDoc } from './canvas';
import { addAttribute, megabyte, removeAttribute, Select, str } from '../../utils';
import { initializePlayer } from '../player';
import { VideoDoc } from '../../models';
import { chooseFiles } from '../filepicker';
import './playlist.css';

let currentVideoId: string,
   playerInitialized: boolean,
   currentListItem: HTMLElement,
   currentVideoFileName: string,
   switchingVideo: boolean,
   videoNode: HTMLVideoElement;

const supportedFileTypes = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime'],
   allFileNames: Array<string> = [],
   videoDocs: Array<VideoDoc> = [];

const listItemCount = Select('#playlist-item-count'),
   listItemsContainer = Select('#playlist-panel-items'),
   currentListItemIndex = Select('#current-playlist-item'),
   addToPlayListButton = Select('#add-to-playlist'),
   videoTileTemplate = Select('template#playlist-tile');

const removePlaceholder = () => {
   const placeholder = document.querySelector('#playlist-placeholder');
   placeholder && placeholder.parentElement!.removeChild(placeholder);
};

const changeVideo = async (videoDoc: VideoDoc, playListItemElement: HTMLElement) => {
   if (currentVideoId && currentVideoId === videoDoc.videoId) {
      return;
   }

   switchingVideo = true;
   videoNode.pause();
   videoNode.currentTime = 0;
   window.scrollTo(0, 0);

   currentVideoFileName = videoDoc.fileName;

   currentListItem && removeAttribute(currentListItem, 'active');

   if (playListItemElement) {
      const currentIdx = videoDocs.findIndex((doc) => doc.fileName === videoDoc.fileName);
      currentListItemIndex.innerHTML = str(currentIdx + 1);
      currentListItem = playListItemElement;
      addAttribute(playListItemElement, 'active');
   }

   videoNode.autoplay = true;
   videoNode.src = videoDoc.blobURL;
   switchingVideo = false;
};

const appendVideoTile = (videoDoc: VideoDoc) => {
   const newVideoTile = document.createElement('video-tile');
   newVideoTile.innerHTML = videoTileTemplate.innerHTML;
   newVideoTile.id = 'video-tile';

   const videoAnchor = newVideoTile.querySelector('a')!;
   videoAnchor.href = videoDoc.url;
   videoAnchor.id = 'video-link';

   const thumbnail = videoAnchor.querySelector('img')!;
   thumbnail.src = videoDoc.thumbnails.small;

   const timeBox = videoAnchor.querySelector('#time-box')!;
   timeBox.innerHTML = videoDoc.durationText;

   const title = videoAnchor.querySelector('#video-title')!;
   title.innerHTML = videoDoc.title;
   title.setAttribute('title', videoDoc.title);

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
      videoNode.controls = true;
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
