import './styles';
import './theme';
import './components/player';
import './components/header';
import './components/filepicker';
import './components/playlist';
import './components/videoinfo';

import { environment } from '../environment';

if (environment.isDev) {
   import('./dev').then((m) => m.default());
}
