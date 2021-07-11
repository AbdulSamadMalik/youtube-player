declare type VideoState = 'playing' | 'paused' | 'completed';
declare type VolumeState = 'zero' | 'half' | 'full';

declare interface VideoInput {
   source: Blob | File | string;
   fileName?: string;
   lastModified?: number;
   views?: number;
}
