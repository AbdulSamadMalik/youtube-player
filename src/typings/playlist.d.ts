declare interface VideoDocument {
   id: string;
   blobLocation: string;
   duration: number;
   dateAsNumber: number;
   fileName: string;
   thumbnails: VideoDocumentThumbnails;
}

declare interface VideoDocumentThumbnails {
   small: string;
}
