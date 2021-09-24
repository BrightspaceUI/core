let framed;

export async function isFramed() {
	if (framed !== undefined) return framed;

	if ((window.D2L && window.D2L.IsNotAnIframedApp) || window === window.parent) {
		framed = false;
		return framed;
	}

	const handleIsFramedResponse = (evt, resolve) => {
		if (!evt || !evt.data || !evt.data.isFramed) return;
		window.removeEventListener('message', evt => handleIsFramedResponse(evt, resolve), false);
		framed = evt.data.isFramed;
		resolve();
	};

	await Promise.race([
		new Promise(resolve => {
			window.addEventListener('message', evt => handleIsFramedResponse(evt, resolve), false);
			window.parent.postMessage('isFramedRequest', '*');
		}),
		new Promise(resolve => {
			setTimeout(() => {
				framed = false;
				resolve();
			}, 75);
		})
	]);

	return framed;
}
