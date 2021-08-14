declare type VideoState = 'playing' | 'paused' | 'completed';
declare type VolumeState = 'zero' | 'half' | 'full';

declare interface VideoInput {
   source: Blob | File | string;
   title: string;
   lastModified?: number;
   views?: number;
   startAt?: number;
}
