import './playlist.css';

const videoRef = document.createElement('video');
videoRef.muted = true;
videoRef.preload = 'auto';

let currentVideoId = null,
   controlShowTimer = null,
   playerInitialized = false,
   currentPlayListItemElement = null,
   currentFileName = null,
   currentVideoStoredTime = null,
   currentVideoViews = null,
   currentVideoSrc = null,
   videoSwitchTimer = null,
   switchingVideo = false;

const supportedFileTypes = ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime'],
   captureAt = Infinity,
   allFileNames = [],
   videoDocuments = [];
