let framedPromise;

export function isFramed() {
	if (framedPromise !== undefined) return framedPromise;

	if (window.D2L && window.D2L.IsNotAnIframedApp) {
		framedPromise = Promise.resolve(false);
		return framedPromise;
	}

	try {
		if (window === window.parent) {
			framedPromise = Promise.resolve(false);
			return framedPromise;
		}
	} catch {
		framedPromise = Promise.resolve(false);
		return framedPromise;
	}

	framedPromise = Promise.race([
		new Promise(resolve => {
			const handleIsFramedResponse = evt => {
				if (!evt || !evt.data || evt.data.isFramed === undefined) return;
				window.removeEventListener('message', handleIsFramedResponse, false);
				resolve(evt.data.isFramed);
			};

			window.addEventListener('message', handleIsFramedResponse, false);
			window.parent.postMessage('isFramedRequest', '*');
		}),
		new Promise(resolve => {
			setTimeout(() => {
				resolve(false);
			}, 150);
		})
	]);

	return framedPromise;
}
