export async function getIfrauBackdropService(ifrauBackdropService) {
	if (!window.ifrauclient) return;
	if (ifrauBackdropService) return ifrauBackdropService;

	const ifrauClient = await window.ifrauclient().connect();
	ifrauBackdropService = await ifrauClient.getService('dialogWC', '0.1');

	return ifrauBackdropService;
}
