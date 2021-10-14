import { isFramed } from './framed.js';

let ifrauBackdropService;

export async function tryGetIfrauBackdropService() {
	if (!await isFramed()) return null;
	if (ifrauBackdropService) return ifrauBackdropService;

	const ifrau = await import('ifrau/client/slim.js');
	const ifrauClient = await new ifrau.SlimClient().connect();
	ifrauBackdropService = await ifrauClient.getService('dialogWC', '0.1');

	return ifrauBackdropService;
}
