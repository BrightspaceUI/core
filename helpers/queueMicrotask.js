window.queueMicrotask = window.queueMicrotask || function(cb) {
	Promise.resolve()
		.then(cb)
		.catch(e => setTimeout(() => { throw e; }));
};
