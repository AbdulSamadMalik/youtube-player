import { createInstance } from 'localforage';

const DB_NAME = 'database';

const videoDocsStorage = createInstance({ name: DB_NAME, storeName: 'video_docs' });
const videoTimeStorage = createInstance({ name: DB_NAME, storeName: 'video_times' });
const videoViewsStorage = createInstance({ name: DB_NAME, storeName: 'video_views' });

/** Saves current video time to storage */
export function saveVideoTime(key: string, time: number) {
   videoTimeStorage.setItem(key, time > 4 ? time : 0);
}

/** Gets current video time from storage */
export async function getVideoTime(key: string): Promise<number> {
   return (await videoTimeStorage.getItem<number>(key)) || 0;
}

/** Updates video view count and save to storage */
export async function updateVideoViews(key: string) {
   const storedViews = await videoViewsStorage.getItem<number>(key);
   const calculatedViews = storedViews ? storedViews + 1 : 1;
   videoViewsStorage.setItem(key, calculatedViews);
}

/** Gets video view count from storage */
export async function getVideoViews(key: string): Promise<number> {
   if (!key) return 0;
   return (await videoViewsStorage.getItem(key)) || 0;
}

/** Gets `VideoDoc` from storage */
export function getVideoDoc(key: string): Promise<VideoDoc | null> {
   return videoDocsStorage.getItem(key);
}

/** Saves `VideoDoc` to storage */
export function saveVideoDoc(key: string, videoDoc: VideoDoc) {
   return videoDocsStorage.setItem<VideoDoc>(key, videoDoc);
}
