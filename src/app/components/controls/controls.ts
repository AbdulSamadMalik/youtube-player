import { $, conditionalAttribute, conditionalClass } from '../../utils/dom';
import { formatTime, elementToRange, clamp } from '../../utils';
import { fromEvent, merge, of } from 'rxjs';
import { delay, mapTo, switchMap, tap } from 'rxjs/operators';
import { videoNode, videoState, videoPlayer, videoPreview } from '../player';
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
   volumeControlInput = $('.volume-adjust #range'),
   videoPreviewContainer = $('.video-preview#container'),
   videoPreviewText = $('.video-preview#text');

const setSeekbarScrubberPosition = (time: number) => {
   const percent = (time / videoNode.duration) * 100;
   videoPlayedBar.style.width = percent + '%';
   videoScrubber.style.left = percent + '%';
};

const updateVolumeScrubberPosition = (e: Event) => {
   const target = e.target as HTMLInputElement,
      volume = target.valueAsNumber / 20;

   videoNode.volume = volume;
   volumeScrubber.style.left = volume * 80 + '%';
   voulumeDisplayBar.style.width = volume * 100 + '%';
};

const volumeAdjusterHidden = (value: boolean) => () => {
   conditionalAttribute(volumeAdjust, !value, 'aria-expanded');
};

const videoPreviewHidden = (value: boolean) => {
   conditionalClass(videoPreviewContainer, value, 'hidden');
};

const onSeekbarMouseMove = (e: MouseEvent) => {
   const target = e.target as HTMLElement,
      percent = (e.offsetX / target.offsetWidth) * 100,
      time = (videoNode.duration * percent) / 100,
      previewWidth = videoPreviewContainer.offsetWidth / 1.8;

   videoPreview.currentTime = time;
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
   currentTimeDisplay.innerHTML = formatTime(time);
};

const onVideoTimeUpdate = () => {
   const time = videoNode.currentTime;
   setSeekbarScrubberPosition(time);
   currentTimeDisplay.innerHTML = formatTime(time);
};

const togglePlayPause = () => {
   videoNode.paused ? videoNode.play() : videoNode.pause();
};

const onVideoStateChange = (state: VideoState) => {
   playPauseButton.id = state;
   videoPlayer.className = state;
};

const changeVolume = (difference: number) => {
   const clampedVolume = clamp(videoNode.volume + difference, 0, 1);
   videoNode.volume = Math.round(clampedVolume * 100) / 100;
};

const setVolumeByMouseWheel = (ev: WheelEvent) => {
   ev.preventDefault();
   ev.deltaY < 0 ? changeVolume(+0.1) : changeVolume(-0.1);
};

const checkForVolumeChange = () => {
   const volume = videoNode.volume;
   volumeScrubber.style.left = volume * 80 + '%';
   voulumeDisplayBar.style.width = volume * 100 + '%';
};

const onVideoMetadataLoad = () => {
   durationTimeDisplay.innerHTML = formatTime(videoNode.duration);
};

const initializeVideoPreview = () => {
   const delayer = {
      value: 15,
      defaultValue: 15,
      off: () => (delayer.value = 0),
      on: () => (delayer.value = delayer.defaultValue),
   };

   const mouseEnter = fromEvent(seekbarContainer, 'mouseenter').pipe(mapTo(false));
   const mouseMove = fromEvent(seekbarContainer, 'mousemove').pipe(mapTo(false));
   const mouseLeave = fromEvent(seekbarContainer, 'mouseleave').pipe(tap(delayer.on), mapTo(true));
   const mouseClick = fromEvent(seekbarContainer, 'click').pipe(tap(delayer.off), mapTo(true));

   merge(mouseEnter, mouseMove, mouseLeave, mouseClick)
      .pipe(
         switchMap((value) => {
            if (value) return of(value);
            return of(value).pipe(delay(delayer.value));
         })
      )
      .subscribe(videoPreviewHidden);
};

export const initializeControls = () => {
   // Video playback state
   videoState.subscribe(onVideoStateChange);

   // Video preview
   checkForVolumeChange();
   initializeVideoPreview();

   // Video seekbar related
   elementToRange(seekbarContainer).subscribe(onSeekbarChange);
   seekbarContainer.addEventListener('mousemove', onSeekbarMouseMove);

   // Control listeners
   playPauseButton.addEventListener('click', togglePlayPause);

   //  Volume related
   muteButton.addEventListener('wheel', setVolumeByMouseWheel);
   volumeAdjust.addEventListener('wheel', setVolumeByMouseWheel);
   muteButton.addEventListener('mouseenter', volumeAdjusterHidden(false));
   leftControls.addEventListener('mouseleave', volumeAdjusterHidden(true));
   volumeAdjust.addEventListener('mouseenter', volumeAdjusterHidden(false));
   volumeControlInput.addEventListener('input', updateVolumeScrubberPosition);

   //  Video events
   videoNode.addEventListener('click', togglePlayPause);
   videoNode.addEventListener('timeupdate', onVideoTimeUpdate);
   videoNode.addEventListener('loadedmetadata', onVideoMetadataLoad);
   videoNode.addEventListener('volumechange', checkForVolumeChange);
};
