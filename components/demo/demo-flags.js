import { flags } from '/generated/flags.js';
import { mockFlag } from '../../helpers/flags.js';

const urlParams = new URLSearchParams(window.location.search);

flags?.forEach(flag => {
	const value = urlParams.get(flag.name);
	if (value?.toLowerCase?.() === 'true') mockFlag(flag.name, true);
	else if (value?.toLowerCase?.() === 'false') mockFlag(flag.name, false);
});
