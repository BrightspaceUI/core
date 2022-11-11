
export function keyDown(element, keycode) {
	const event = new CustomEvent('keydown', {
		detail: 0,
		bubbles: true,
		cancelable: true,
		composed: true
	});
	event.keyCode = keycode;
	event.code = keycode;
	element.dispatchEvent(event);
}

export async function getUpdateCompleteAll(node) {

	if (!node || (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE)) {
		throw new TypeError('Invalid node. Must be nodeType document, element or document fragment');
	}

	const getUpdateComplete = async elem => {
		if (elem.updateComplete) await elem.updateComplete;
		const childElements = getComposedChildren(elem);
		await Promise.all(childElements.map(childElement => getUpdateComplete(childElement)));
	};

	return getUpdateComplete(node);
}
