import './helpers/theme';
import './lib/player';
import './lib/header';
import './lib/playlist';
import './lib/choose';
import './styles/main.scss';

if (import.meta.env.DEV) {
   import('./dev').then((module) => module.default());
}
