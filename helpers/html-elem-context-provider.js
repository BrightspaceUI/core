const attributeCallbacks = new Map();

const contextObserver = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		const callbacks = attributeCallbacks.get(mutation.attributeName);
		if (callbacks !== undefined && callbacks.length > 0) {
			callbacks.forEach(callback => callback());
		}
	});
});

let observerInitialized = false;

export function getContext(attributeName) {
	const contextString = document.documentElement.hasAttribute(attributeName)
		? document.documentElement.getAttribute(attributeName)
		: undefined;

	return JSON.parse(contextString);
}

export function registerOnChangeHandler(attributeName, onChange, sendImmediate) {
	if (!observerInitialized) {
		contextObserver.observe(document.documentElement, { attributes: true });
		observerInitialized = true;
	}

	if (sendImmediate) onChange(getContext(attributeName));

	if (!attributeCallbacks.has(attributeName)) attributeCallbacks.set(attributeName, []);
	attributeCallbacks.get(attributeName).push(() => onChange(getContext(attributeName)));
}
