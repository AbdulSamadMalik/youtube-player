import './theme';
import './components/player';
import './components/header';
import './components/filepicker';
import './components/playlist';

if (import.meta.env.DEV) {
   import('../environment/dev').then((module) => module.default());
}
