Object.defineProperty(Array.prototype, 'first', {
   get: function () {
      if (!this.length) return null;
      return this[0];
   },
});

Object.defineProperty(Array.prototype, 'last', {
   get: function () {
      if (!this.length) return null;
      return this[this.length - 1];
   },
});
