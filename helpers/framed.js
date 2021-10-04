let framed;

export async function isFramed() {
	if (framed !== undefined) return framed;

	if (window.D2L && window.D2L.IsNotAnIframedApp) {
		framed = false;
		return framed;
	}

	try {
		if (window === window.parent) {
			framed = false;
			return framed;
		}
	} catch (e) {
		framed = false;
		return framed;
	}

	framed = await Promise.race([
		new Promise(resolve => {
			const handleIsFramedResponse = evt => {
				if (!evt || !evt.data || evt.data.isFramed === undefined) return;
				window.removeEventListener('message', handleIsFramedResponse, false);
				framed = evt.data.isFramed;
				resolve(framed);
			};

			window.addEventListener('message', handleIsFramedResponse, false);
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
