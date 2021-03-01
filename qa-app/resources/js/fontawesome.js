import {config, library, dom} from '@fortawesome/fontawesome-svg-core';
config.autoReplaceSvg = 'nest';
import { faCaretUp, faStar, faCaretDown, faCheck, faSpinner} from '@fortawesome/free-solid-svg-icons';

library.add(faCaretUp, faCaretDown, faCheck, faStar, faSpinner);

dom.watch();