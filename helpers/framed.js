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
		resolve(framed);
	};

	framed = await Promise.race([
		new Promise(resolve => {
			window.addEventListener('message', evt => handleIsFramedResponse(evt, resolve), false);
			window.parent.postMessage('isFramedRequest', '*');
		}),
		new Promise(resolve => {
			setTimeout(() => {
				resolve(false);
			}, 75);
		})
	]);

	return framed;
}
