import { isFramed } from './framed.js';

let ifrauBackdropService;

export async function tryGetIfrauBackdropService() {
	if (!await isFramed()) return null;
	if (ifrauBackdropService) return ifrauBackdropService;

	return ifrauBackdropService;
}
