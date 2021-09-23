window.addEventListener('error', (err) => {
	if (err.message.includes('ResizeObserver')) {
		err.stopImmediatePropagation();
	}
});
