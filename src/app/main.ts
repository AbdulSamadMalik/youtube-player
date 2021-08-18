import './theme';
import './layout/player';
import './layout/header';
import './layout/playlist';
import './layout/dialogs/filePicker';

if (import.meta.env.DEV) {
   import('./dev').then((module) => module.default());
}

// console.log([0, 1].last);
