declare interface VideoDoc {
   date: number;
   fileId: string;
   blobURL: string;
   duration: number;
   fileName: string;
   thumbnail: VideoDocThumbnail;
}

declare interface VideoDocThumbnail {
   dataURL: string;
}
