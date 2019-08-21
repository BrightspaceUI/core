let idTracker = 0;
let eventListener = null;
const stack = [];

function cleanup() {
	if (eventListener && stack.length === 0) {
		document.removeEventListener('keyup', eventListener);
		eventListener = null;
	}
}

function init() {
	if (eventListener !== null) return;
	eventListener = (e) => {
		if (e.keyCode !== 27) {
			return;
		}
		if (stack.length > 0) {
			const entry = stack.splice(stack.length - 1, 1)[0];
			if (typeof entry.cb === 'function') {
				entry.cb();
			}
		}
		cleanup();
	};
	document.addEventListener('keyup', eventListener);
}

export const clearDismissible = (id) => {
	for (let i = 0; i < stack.length; i++) {
		if (stack[i].id === id) {
			stack.splice(i, 1);
			break;
		}
	}
	cleanup();
};

export const setDismissible = (cb) => {
	init();
	const id = ++idTracker;
	stack.push({ id: id, cb: cb });
	return id;
};
