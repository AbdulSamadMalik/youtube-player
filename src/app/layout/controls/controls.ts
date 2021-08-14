import { asyncScheduler, fromEvent, interval, merge, of, Subject } from 'rxjs';
import { debounceTime, delay, mapTo, switchMap, tap, throttleTime } from 'rxjs/operators';
import { registerHotkey } from '../../hotkeys';
import { clamp, formatTime, HTMLRangeInput } from '../../utils';
import { $, conditionalAttribute, conditionalClass, removeAttribute } from '../../utils/dom';
import { header } from '../header';
import {
   videoNode,
   videoState,
   volumeState,
   videoPlayer,
   videoPreview,
   toggleCinemaMode,
   toggleFullScreenMode,
   toggleMiniPlayerMode,
} from '../player';

const videoControls = $('#video-controls.video-controls'),
   seekbarContainer = $('.progress-bar-container'),
   videoHoverBar = $('.progress-bar#hover'),
   videoPlayedBar = $('.progress-bar#played'),
   videoScrubber = $('.progress-bar#scrubber'),
   volumeDisplayBar = $('.volume-adjust#volume'),
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

const hideCtrlSubject = new Subject<null>();

const _controlsHidden = (condition: boolean) => {
   conditionalAttribute(videoPlayer, condition, 'hide-controls');

   condition && videoPreviewHidden(condition);
};

const showControls = () => hideCtrlSubject.next(null);
const hideControls = () => _controlsHidden(true);

hideCtrlSubject
   .pipe(
      tap(() => _controlsHidden(false)),
      debounceTime(3000)
   )
   .subscribe(() => _controlsHidden(true));

const setSeekbarScrubberPosition = (time: number) => {
   const percent = (time / videoNode.duration) * 100;
   videoPlayedBar.style.width = percent + '%';
   videoScrubber.style.left = percent + '%';
};

const onVolumeInput = (e: Event) => {
   const target = e.target as HTMLInputElement,
      volume = target.valueAsNumber / 20;
   changeVolume(volume);
};

const onVolumeChange = () => {
   localStorage.setItem('volume', videoNode.volume.toString());
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
   videoNode.ended && videoNode.play();
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
   if (videoNode.volume > 0 && !videoNode.muted) {
      sessionStorage.setItem('volume', videoNode.volume.toString());
      localStorage.setItem('volume', '0');
      videoNode.volume = 0;
      return;
   }

   const storedVolume = sessionStorage.getItem('volume');
   videoNode.volume = storedVolume ? parseFloat(storedVolume) : 1;
   localStorage.setItem('volume', videoNode.volume.toString());
};

/** Detects volume change and updates the UI */
const detectVolumeChange = (volume?: number | Event) => {
   volume = volume instanceof Event ? videoNode.volume : volume ?? videoNode.volume;
   volumeScrubber.style.left = volume * 80 + '%';
   volumeDisplayBar.style.width = volume * 100 + '%';

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

const seekVideoTo = (newTime: number) => {
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
   registerHotkey('KeyM', toggleMute);
   registerHotkey('Space', togglePlayPause);
   registerHotkey('ArrowUp', () => changeVolumeRelative(+0.05));
   registerHotkey('ArrowDown', () => changeVolumeRelative(-0.05));
   registerHotkey('ArrowLeft', () => seekVideoRelative(-5));
   registerHotkey('ArrowRight', () => seekVideoRelative(+5));
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

const checkForStoredVolume = () => {
   // const storedVolume = sessionStorage.getItem('volume') || localStorage.getItem('volume') || '1';
   const storedVolume = localStorage.getItem('volume') || '1';
   const parsedVolume = parseFloat(storedVolume);
   videoNode.volume = isNaN(parsedVolume) ? 1 : parsedVolume;
};

const addNumpadListeners = () => {
   const keyCodes: EventCode[] = [
      'Numpad0',
      'Numpad1',
      'Numpad2',
      'Numpad3',
      'Numpad4',
      'Numpad5',
      'Numpad6',
      'Numpad7',
      'Numpad8',
      'Numpad9',
   ];
   keyCodes.forEach((keyCode) => {
      registerHotkey(keyCode, () => {
         console.log(parseInt(keyCode));
         seekVideoTo((videoNode.duration * parseInt(keyCode) * 10) / 100);
      });
   });
};

const storeVolumeToStorage = (volume: any) => {
   if (typeof volume != 'number') {
      volume = videoNode.volume;
   }

   localStorage.setItem('volume', volume.toString());
};

export const initializeControls = () => {
   // Video playback state
   removeAttribute(videoControls, 'hidden');
   videoState.subscribe(onVideoStateChange);
   volumeState.subscribe(onVolumeStateChange);

   // Video preview
   initializeHotkeys();
   addNumpadListeners();
   detectVolumeChange();
   checkForStoredVolume();
   initializeVideoPreview();

   // Seekbar related
   HTMLRangeInput(seekbarContainer).subscribe(onSeekbarChange);
   seekbarContainer.addEventListener('mousemove', onSeekbarMouseMove);

   // listeners
   cinemaButton.addEventListener('click', toggleCinemaMode);
   playPauseButton.addEventListener('click', togglePlayPause);
   scrollButton.addEventListener('click', onScrollButtonClick);
   fullScreenButton.addEventListener('click', toggleFullScreenMode);
   miniPlayerButton.addEventListener('click', toggleMiniPlayerMode);
   videoNode.addEventListener('click', togglePlayPause);
   videoNode.addEventListener('loadedmetadata', onVideoMetadataLoad);
   videoNode.addEventListener('volumechange', detectVolumeChange);

   //  Volume related
   muteButton.addEventListener('click', toggleMute);
   volumeControlInput.addEventListener('input', onVolumeInput);
   volumeControlInput.addEventListener('change', onVolumeChange);
   muteButton.addEventListener('wheel', setVolumeByMouseWheel);
   volumeAdjust.addEventListener('wheel', setVolumeByMouseWheel);
   muteButton.addEventListener('mouseenter', volumeAdjusterHidden(false));
   leftControls.addEventListener('mouseleave', volumeAdjusterHidden(true));
   volumeAdjust.addEventListener('mouseenter', volumeAdjusterHidden(false));

   // Subscriptions
   const $bodyScroll = fromEvent(document.body, 'scroll');
   const $windowScroll = fromEvent(window, 'scroll');

   $bodyScroll.subscribe(onBodyScroll);
   interval(15).subscribe(onVideoTimeUpdate); // Interval for smooth seekbar
   merge($bodyScroll, $windowScroll).pipe(delay(100)).subscribe(showControls);
   fromEvent(videoNode, 'volumechange')
      .pipe(throttleTime(750, asyncScheduler, { trailing: true }))
      .subscribe(storeVolumeToStorage);
};

// Exports
export { changeVolume, changeVolumeRelative, showControls, hideControls, scrollButton };
