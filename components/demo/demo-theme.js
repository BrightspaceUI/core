import { setPreferredTheme } from '../../helpers/theme.js';

const urlParams = new URLSearchParams(window.location.search);
setPreferredTheme(urlParams.get('preferred-theme'));
