// eslint-disable-next-line no-undef
before(() => {
	const e = window.onerror;
	window.onerror = function(err) {
		if (err === 'ResizeObserver loop limit exceeded') {
			console.warn('Ignored: ResizeObserver loop limit exceeded');
			return false;
		} else if (err === 'ResizeObserver loop completed with undelivered notifications.') {
			console.warn('Ignored: ResizeObserver loop completed with undelivered notifications');
			return false;
		} else {
			return e(...arguments);
		}
	};
});
