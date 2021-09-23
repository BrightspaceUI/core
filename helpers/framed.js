let framedPromise;

export async function isFramed() {
	if (framedPromise !== undefined) return framedPromise;

	if ((window.D2L && window.D2L.IsNotAnIframedApp) || window === window.parent) {
		framedPromise = Promise.resolve(false);
		return framedPromise;
	}

	const handleIsFramedResponse = (evt, resolve) => {
		if (!evt || !evt.data || !evt.data.isFramed) return;
		window.removeEventListener('message', evt => handleIsFramedResponse(evt, resolve), false);
		resolve(evt.data.isFramed);		
	};

	framedPromise = Promise.race([
		new Promise(resolve => {
			window.addEventListener('message', evt => handleIsFramedResponse(evt, resolve), false);
			window.parent.postMessage('isFramedRequest', '*');
		}),
		new Promise(resolve => setTimeout(() => resolve(false), 100))
	]);

	return framedPromise;
}