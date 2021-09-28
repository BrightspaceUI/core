import { isFramed } from './framed.js';
import { SlimClient } from 'ifrau/client/slim.js';

let ifrauBackdropService;

export async function tryGetIfrauBackdropService() {
	if (!await isFramed()) return null;
	if (ifrauBackdropService) return ifrauBackdropService;

	const ifrauClient = await new SlimClient().connect();
	ifrauBackdropService = await ifrauClient.getService('dialogWC', '0.1');

	return ifrauBackdropService;
}
