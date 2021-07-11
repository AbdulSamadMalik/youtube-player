import { $, conditionalAttribute, conditionalClass, removeAttribute } from '../../utils/dom';
import { formatTime, elementToRange, clamp } from '../../utils';
import { fromEvent, interval, merge, of, asyncScheduler, throttleTime, Subscription } from 'rxjs';
import { delay, mapTo, switchMap, tap } from 'rxjs/operators';
import {
   videoNode,
   videoState,
   videoPlayer,
   videoPreview,
   volumeState,
   toggleCinemaMode,
   toggleFullScreenMode,
   toggleMiniPlayerMode,
} from '../player';
import { registerHotkey } from '../../hotkeys';
import { header } from '../header';

const videoControls = $('#video-controls.video-controls'),
   seekbarContainer = $('.progress-bar-container'),
   videoHoverBar = $('.progress-bar#hover'),
   videoPlayedBar = $('.progress-bar#played'),
   videoScrubber = $('.progress-bar#scrubber'),
   voulumeDisplayBar = $('.volume-adjust#volume'),
   volumeScrubber = $('.volume-adjust#scrubber'),
   currentTimeDisplay = $('.time-current'),
   durationTimeDisplay = $('.time-duration'),
   volumeAdjust = $('#volume-adjust'),
   leftControls = $('.video-controls.left'),
   muteButton = $('.control-button.mute-button'),
   miniPlayerButton = $('.control-button.miniplayer-button'),
   cinemaButton = $('.control-button.cinema-button'),
   fullScreenButton = $('.control-button.fullscreen-button'),
   playPauseButton = $('.control-button.play-button'),
   scrollButton = $('.control-button.fullscreen-scroll-button'),
   volumeControlInput = $('.volume-adjust #range'),
   videoPreviewContainer = $('.video-preview#container'),
   videoPreviewText = $('.video-preview#text');

const setSeekbarScrubberPosition = (time: number) => {
   const percent = (time / videoNode.duration) * 100;
   videoPlayedBar.style.width = percent + '%';
   videoScrubber.style.left = percent + '%';
};

const onVolumeInputChange = (e: Event) => {
   const target = e.target as HTMLInputElement,
      volume = target.valueAsNumber / 20;
   changeVolume(volume);
};

const volumeAdjusterHidden = (isHidden: boolean) => () => {
   conditionalAttribute(volumeAdjust, !isHidden, 'aria-expanded');
};

const videoPreviewHidden = (isHidden: boolean) => {
   conditionalClass(videoPreviewContainer, isHidden, 'hidden');
};

const onSeekbarMouseMove = (e: MouseEvent) => {
   const target = e.target as HTMLElement,
      percent = (e.offsetX / target.offsetWidth) * 100,
      time = (videoNode.duration * percent) / 100,
      previewWidth = videoPreviewContainer.offsetWidth / 1.98;

   videoPreview.currentTime = clamp(time, 0, videoPreview.duration);
   videoPreviewText.innerHTML = formatTime(time, 1, 2);
   videoHoverBar.style.width = percent + '%';

   if (e.offsetX > previewWidth && e.offsetX < target.offsetWidth - previewWidth) {
      videoPreviewContainer.style.left = e.offsetX + 'px';
   } else if (e.offsetX < previewWidth) {
      videoPreviewContainer.style.left = previewWidth + 'px';
   } else if (e.offsetX > target.offsetWidth - previewWidth) {
      videoPreviewContainer.style.left = target.offsetWidth - previewWidth + 'px';
   }
};

const onSeekbarChange = (percent: number) => {
   const time = videoNode.duration * (percent / 100);
   setSeekbarScrubberPosition(time);
   videoNode.currentTime = time;
   videoHoverBar.style.width = percent + '%';
   currentTimeDisplay.innerHTML = formatTime(time, 1, 2);
};

const detectVideoTimeUpdate = (newTime: number) => {
   setSeekbarScrubberPosition(newTime);
   currentTimeDisplay.innerHTML = formatTime(newTime, 1, 2);
};

const onVideoTimeUpdate = () => detectVideoTimeUpdate(videoNode.currentTime);

const togglePlayPause = () => {
   videoNode.paused ? videoNode.play() : videoNode.pause();
};

const onVideoStateChange = (state: VideoState) => {
   playPauseButton.id = state;
   videoPlayer.className = state;
};

const onVolumeStateChange = (state: VolumeState) => {
   muteButton.id = state;
};

const toggleMute = () => {
   if (videoNode.volume > 0) {
      sessionStorage.setItem('volume', videoNode.volume.toString());
      videoNode.volume = 0;
      return;
   }

   const storedVolume = sessionStorage.getItem('volume');
   videoNode.volume = storedVolume ? parseFloat(storedVolume) : 1;
};

/** Detect the change in volume and updates the UI */
const detectVolumeChange = (volume?: number | Event) => {
   volume = volume instanceof Event ? videoNode.volume : volume ?? videoNode.volume;
   volumeScrubber.style.left = volume * 80 + '%';
   voulumeDisplayBar.style.width = volume * 100 + '%';

   if (volume === 0 || videoNode.muted) {
      volumeState.next('zero');
   } else if (volume < 0.5) {
      volumeState.next('half');
   } else {
      volumeState.next('full');
   }
};

/** Changes video volume to given value */
const changeVolume = (value: number) => {
   const clampedVolume = clamp(value, 0, 1);
   videoNode.volume = Math.round(clampedVolume * 100) / 100;
   detectVolumeChange(clampedVolume);
};

/** Changes video volume relative to current video volume */
const changeVolumeRelative = (difference: number) => {
   changeVolume(videoNode.volume + difference);
};

const seekVideo = (newTime: number) => {
   detectVideoTimeUpdate(newTime);
   videoNode.currentTime = clamp(newTime, 0, videoNode.duration);
};

const seekVideoRelative = (difference: number) => {
   const newTime = videoNode.currentTime + difference,
      clampedTime = clamp(newTime, 0, videoNode.duration);
   detectVideoTimeUpdate(clampedTime);
   videoNode.currentTime = clampedTime;
};

const setVolumeByMouseWheel = (ev: WheelEvent) => {
   ev.preventDefault();
   ev.deltaY < 0 ? changeVolumeRelative(+0.1) : changeVolumeRelative(-0.1);
};

const onVideoMetadataLoad = () => {
   durationTimeDisplay.innerHTML = formatTime(videoNode.duration, 1, 2);
};

/** Body will only scroll if fullscreen mode is on */
const onBodyScroll = () => {
   const condition = document.body.scrollTop > 0;
   conditionalAttribute(scrollButton, condition, 'hide');
   conditionalAttribute(header, condition, 'show');
};

const onScrollButtonClick = () => {
   document.body.scrollTo({
      left: 0,
      top: 185,
      behavior: 'smooth',
   });
};

const initializeHotkeys = () => {
   // Hotkeys
   registerHotkey({ eventCode: 'KeyM', handler: toggleMute });
   registerHotkey({ eventCode: 'Space', handler: togglePlayPause });
   registerHotkey({ eventCode: 'ArrowUp', handler: () => changeVolumeRelative(+0.05) });
   registerHotkey({ eventCode: 'ArrowDown', handler: () => changeVolumeRelative(-0.05) });
   registerHotkey({ eventCode: 'ArrowLeft', handler: () => seekVideoRelative(-5) });
   registerHotkey({ eventCode: 'ArrowRight', handler: () => seekVideoRelative(+5) });
};

const initializeVideoPreview = () => {
   let delayValue = 15;

   const defaultDelay = delayValue,
      delayOff = () => (delayValue = 0),
      delayOn = () => (delayValue = defaultDelay);

   const click = fromEvent(seekbarContainer, 'click').pipe(tap(delayOff), mapTo(true)),
      mouseEnter = fromEvent(seekbarContainer, 'mouseenter').pipe(mapTo(false)),
      mouseMove = fromEvent(seekbarContainer, 'mousemove').pipe(mapTo(false)),
      mouseLeave = fromEvent(seekbarContainer, 'mouseleave').pipe(tap(delayOn), mapTo(true));

   merge(mouseEnter, mouseMove, mouseLeave, click)
      .pipe(switchMap((bool) => of(bool).pipe(delay(!bool ? delayValue : 0))))
      .subscribe(videoPreviewHidden);

   merge(mouseEnter, mouseLeave)
      .pipe(switchMap((bool) => of(bool).pipe(delay(!bool ? delayValue : 0))))
      .subscribe((bool) => conditionalAttribute(seekbarContainer, !bool, 'hover'));
};

export const initializeControls = () => {
   // Video playback state
   removeAttribute(videoControls, 'hidden');
   videoState.subscribe(onVideoStateChange);
   volumeState.subscribe(onVolumeStateChange);

   // Video preview
   initializeHotkeys();
   detectVolumeChange();
   initializeVideoPreview();

   // Video seekbar related
   elementToRange(seekbarContainer).subscribe(onSeekbarChange);
   seekbarContainer.addEventListener('mousemove', onSeekbarMouseMove);

   // Control listeners
   cinemaButton.addEventListener('click', toggleCinemaMode);
   playPauseButton.addEventListener('click', togglePlayPause);
   scrollButton.addEventListener('click', onScrollButtonClick);
   fullScreenButton.addEventListener('click', toggleFullScreenMode);
   miniPlayerButton.addEventListener('click', toggleMiniPlayerMode);

   //  Volume related
   muteButton.addEventListener('click', toggleMute);
   muteButton.addEventListener('wheel', setVolumeByMouseWheel);
   volumeAdjust.addEventListener('wheel', setVolumeByMouseWheel);
   volumeControlInput.addEventListener('input', onVolumeInputChange);
   muteButton.addEventListener('mouseenter', volumeAdjusterHidden(false));
   leftControls.addEventListener('mouseleave', volumeAdjusterHidden(true));
   volumeAdjust.addEventListener('mouseenter', volumeAdjusterHidden(false));

   // Subscriptions
   fromEvent(document.body, 'scroll').subscribe(onBodyScroll);
   interval(15).subscribe(onVideoTimeUpdate); // Interval for smooth seekbar

   //  Video events
   videoNode.addEventListener('click', togglePlayPause);
   videoNode.addEventListener('loadedmetadata', onVideoMetadataLoad);
   videoNode.addEventListener('volumechange', detectVolumeChange);
};

// Exports
export { changeVolume, changeVolumeRelative, scrollButton };
