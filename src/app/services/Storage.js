var Storage = /** @class */ (function () {
   function Storage() {}
   Storage._getValue = function (value) {
      return typeof value === 'function' ? value() : value;
   };
   Storage.set = function (storeName, value) {
      localStorage.setItem(storeName, JSON.stringify({ value: this._getValue(value) }));
   };
   Storage.get = function (storeName, defaultValue) {
      if (defaultValue === void 0) {
         defaultValue = null;
      }
      try {
         var stored = localStorage.getItem(storeName);
         if (stored === null) {
            return this._getValue(defaultValue);
         }
         var parsed = JSON.parse(stored)['value'];
         return parsed;
      } catch (error) {
         return this._getValue(defaultValue);
      }
   };
   Storage.remove = function (storedName) {
      localStorage.removeItem(storedName);
   };
   return Storage;
})();
export { Storage };
