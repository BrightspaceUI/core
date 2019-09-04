// Shim copied from Google Developer Updates: https://developers.google.com/web/updates/2015/08/using-requestidlecallback
window.requestIdleCallback = window.requestIdleCallback || function(cb) {
	const start = Date.now();
	return setTimeout(() => {
		cb({
			didTimeout: false,
			timeRemaining: function() {
				return Math.max(0, 50 - (Date.now() - start));
			}
		});
	}, 1);
};

window.cancelIdleCallback = window.cancelIdleCallback || function(id) {
	clearTimeout(id);
};
