let ifrauBackdropService;

export async function tryGetIfrauBackdropService() {
	if (!window.ifrauclient) return null;
	if (ifrauBackdropService) return ifrauBackdropService;

	const ifrauClient = await window.ifrauclient().connect();
	ifrauBackdropService = await ifrauClient.getService('dialogWC', '0.1');

	return ifrauBackdropService;
}
