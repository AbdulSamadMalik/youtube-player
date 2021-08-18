declare interface VideoDoc {
   date: number;
   blobURL: string;
   duration: number;
   fileName: string;
   thumbnail: VideoDocThumbnail;
}

declare interface VideoDocThumbnail {
   dataURL: string;
}
