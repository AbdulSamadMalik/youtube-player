export interface VideoDoc {
   videoId: string;
   url: string;
   fileURL: string;
   durationText: string;
   dateText: string;
   title: string;
   fileName: string;
   thumbnails: {
      small: string;
   };
}
