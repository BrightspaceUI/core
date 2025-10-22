import { mockFlag } from '../../helpers/flags.js';

const urlParams = new URLSearchParams(window.location.search);

urlParams.forEach((value, key) => {
	if (!key.startsWith('demo-flag-')) return;
	key = key.substring(10);
	if (value?.toLowerCase?.() === 'true') mockFlag(key, true);
	else if (value?.toLowerCase?.() === 'false') mockFlag(key, false);
});
