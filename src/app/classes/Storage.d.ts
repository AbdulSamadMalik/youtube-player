export declare class Storage {
   private static _getValue;

   static set<T>(storeName: string, value: T): void;

   static remove(storedName: string): void;

   static get(storeName: string): any;
   static get<T>(storeName: string): T | null;
   static get<T>(storeName: string, defaultValue?: T): T;
}
