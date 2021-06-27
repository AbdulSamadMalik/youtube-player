import { $, conditionalAttribute, formatTime, setStyle, elementToRange } from '../../utils';
import { videoNode, videoState, videoPlayer } from '../player';
import './controls.css';

const seekbarContainer = $('.progress-bar-container'),
   videoHoverBar = $('.progress-bar#hover'),
   videoPlayedBar = $('.progress-bar#played'),
   videoScrubber = $('.progress-bar#scrubber'),
   voulumeDisplayBar = $('.volume-adjust#volume'),
   volumeScrubber = $('.volume-adjust#scrubber'),
   currentTimeDisplay = $('.time-current'),
   durationTimeDisplay = $('.time-duration'),
   volumeAdjust = $('#volume-adjust'),
   leftControls = $('.video-controls-left'),
   muteButton = $('.control-button.mute-button'),
   playPauseButton = $('.control-button.play-button'),
   volumeControlInput = $('.volume-adjust #range');

const updateVideoScrubberPosition = (time: number) => {
   const percent = (time / videoNode.duration) * 100;
   setStyle(videoPlayedBar, 'width', percent + '%');
   setStyle(videoScrubber, 'left', percent + '%');
};

const updateVolumeScrubberPosition = (e: Event) => {
   const target = e.target as HTMLInputElement,
      volume = target.valueAsNumber / 20;
   setStyle(volumeScrubber, 'left', volume * 80 + '%');
   setStyle(voulumeDisplayBar, 'width', volume * 100 + '%');
   videoNode.volume = volume;
};

const volumeAdjusterHidden = (value: boolean) => {
   return function () {
      conditionalAttribute(volumeAdjust, !value, 'aria-expanded');
   };
};

const onSeekbarMouseMove = (e: MouseEvent) => {
   const target = e.target as HTMLElement,
      percent = (e.offsetX / target.offsetWidth) * 100;
   setStyle(videoHoverBar, 'width', percent + '%');
};

const onSeekbarChange = (percent: number) => {
   const timeOnClick = videoNode.duration * (percent / 100);
   updateVideoScrubberPosition(timeOnClick);
   setStyle(videoHoverBar, 'width', percent + '%');
   videoNode.currentTime = timeOnClick;
   currentTimeDisplay.innerHTML = formatTime(timeOnClick);
};

const onVideoTimeUpdate = () => {
   const time = videoNode.currentTime;
   updateVideoScrubberPosition(time);
   currentTimeDisplay.innerHTML = formatTime(time);
};

const onVideoMetadataLoad = () => {
   durationTimeDisplay.innerHTML = formatTime(videoNode.duration);
};

const togglePlayPause = () => {
   videoNode.paused ? videoNode.play() : videoNode.pause();
};

const onVideoStateChange = (state: VideoState) => {
   playPauseButton.id = state;
   videoPlayer.className = state;
};

export const initializeControls = () => {
   // Video playback state
   videoState.subscribe(onVideoStateChange);

   // Video seekbar
   elementToRange(seekbarContainer).subscribe(onSeekbarChange);
   seekbarContainer.addEventListener('mousemove', onSeekbarMouseMove);

   //  Volume seekbar
   volumeControlInput.addEventListener('input', updateVolumeScrubberPosition);
   muteButton.addEventListener('mouseenter', volumeAdjusterHidden(false));
   volumeAdjust.addEventListener('mouseenter', volumeAdjusterHidden(false));
   leftControls.addEventListener('mouseleave', volumeAdjusterHidden(true));

   //  Video events
   videoNode.addEventListener('click', togglePlayPause);
   videoNode.addEventListener('timeupdate', onVideoTimeUpdate);
   videoNode.addEventListener('loadedmetadata', onVideoMetadataLoad);
};
