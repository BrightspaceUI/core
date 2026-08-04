// needed for legacy-Edge, after it's removed use CSS.escape directly
export function cssEscape(val) {
	if (window.CSS && window.CSS.escape) {
		return window.CSS.escape(val);
	}
	val = val.replace(/\$/g, '\\$');
	return val;
}

export function elemIdListAdd(elem, attrName, value) {

	if (elem === undefined || elem === null || !elem.getAttribute || !elem.setAttribute) {
		throw new TypeError('elemIdListAdd: "elem" must be a valid DOM Element');
	}
	if (typeof(attrName) !== 'string') {
		throw new TypeError('elemIdListAdd: "attrName" must be a valid string');
	}
	if (typeof(value) !== 'string') {
		throw new TypeError('elemIdListAdd: "value" must be a valid ID string');
	}

	const parts = elem.hasAttribute(attrName) ? elem.getAttribute(attrName).split(' ') : [];
	if (parts.indexOf(value) > -1) return;

	parts.push(value);
	elem.setAttribute(attrName, parts.join(' '));

}

export function elemIdListRemove(elem, attrName, value) {

	if (elem === undefined || elem === null || !elem.getAttribute || !elem.setAttribute) {
		throw new TypeError('elemIdListRemove: "elem" must be a valid DOM Element');
	}
	if (typeof(attrName) !== 'string') {
		throw new TypeError('elemIdListRemove: "attrName" must be a valid string');
	}
	if (typeof(value) !== 'string') {
		throw new TypeError('elemIdListRemove: "value" must be a valid ID string');
	}

	const existingValue = elem.getAttribute(attrName) || '';

	const parts = existingValue.split(' ');
	const index = parts.indexOf(value);
	if (index === -1) return;

	if (parts.length === 1) {
		elem.removeAttribute(attrName);
	} else {
		parts.splice(index, 1);
		elem.setAttribute(attrName, parts.join(' '));
	}

}

export function findComposedAncestor(node, predicate) {
	while (node) {
		if (predicate(node) === true) {
			return node;
		}
		node = getComposedParent(node);
	}
	return null;
}

export function getBoundingAncestor(node) {
	return findComposedAncestor(node, (node) => {
		if (node === document.body) return false;
		// explicitly ignore slot element, required for Edge
		if (node.tagName === 'SLOT') return false;
		if (node === document.documentElement) return true;
		if (node.nodeType === Node.ELEMENT_NODE) {
			const overflow = window.getComputedStyle(node, null).getPropertyValue('overflow');
			// treat auto, scroll, hidden, clip as bounding
			return (overflow !== 'visible');
		}
		return false;
	});
}

function getComposedChildNodes(node, { elementsOnly = false, predicate } = {}) {

	if (!node) return null;

	if (node.nodeType !== Node.ELEMENT_NODE
		&& node.nodeType !== Node.DOCUMENT_NODE
		&& node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
		return null;
	}

	let nodes;
	const filteredNodes = [];

	if (node.tagName === 'CONTENT') {
		nodes = node.getDistributedNodes();
	} else if (node.tagName === 'SLOT') {
		// note: this is not handling default slot content
		nodes = elementsOnly ? node.assignedElements({ flatten: true }) : node.assignedNodes({ flatten: true });
	} else {
		if (node.shadowRoot) node = node.shadowRoot;
		nodes = elementsOnly ? node.children : node.childNodes;
	}

	for (let i = 0; i < nodes.length; i++) {
		// need to check nodeType since old Polymer getDistributedNodes could return non-elements
		if (!elementsOnly || nodes[i].nodeType === Node.ELEMENT_NODE) {
			if (!predicate || predicate(nodes[i])) filteredNodes.push(nodes[i]);
		}
	}

	return filteredNodes;
}

export function getComposedChildren(node, predicate) {
	return getComposedChildNodes(node, { elementsOnly: true, predicate });
}

function getComposedElementSibling(node, { direction = 'next', predicate } = {}) {

	if (!node || node.nodeType === undefined) return null;

	const parentNode = getComposedParent(node);
	if (!parentNode) return null;

	// for regular parents this is child elements; for SLOT this is distributed elements
	const composedChildNodes = getComposedChildNodes(parentNode, { elementsOnly: (node.nodeType === Node.ELEMENT_NODE) });

	if (!composedChildNodes || composedChildNodes.length === 0) return null;

	const index = composedChildNodes.indexOf(node);
	if (index === -1) return null;

	if (direction === 'previous') {
		for (let i = index - 1; i >= 0; i--) {
			if (composedChildNodes[i].nodeType === Node.ELEMENT_NODE && (!predicate || predicate(composedChildNodes[i]))) {
				return composedChildNodes[i];
			}
		}
	} else {
		for (let i = index + 1; i < composedChildNodes.length; i++) {
			if (composedChildNodes[i].nodeType === Node.ELEMENT_NODE && (!predicate || predicate(composedChildNodes[i]))) {
				return composedChildNodes[i];
			}
		}
	}

	return null;
}

export function getComposedNextAncestorElementSibling(node, { predicate } = {}) {
	let parentNode = getComposedParent(node);

	while (parentNode) {
		const nextParentSibling = getComposedNextElementSibling(parentNode, { predicate });
		if (nextParentSibling) return nextParentSibling;
		parentNode = getComposedParent(parentNode);
	}

	return null;
}

export function getComposedNextElementSibling(node, { predicate } = {}) {
	return getComposedElementSibling(node, { direction: 'next', predicate });
}

export function getComposedParent(node) {

	if (node.getDestinationInsertionPoints) {
		const insertionPoints = node.getDestinationInsertionPoints();
		if (insertionPoints && insertionPoints.length > 0) {
			return insertionPoints[0];
		}
	}

	if (node.assignedSlot) {
		return node.assignedSlot;
	}

	if (node.parentNode) {
		return node.parentNode;
	} else if (node.host) {
		return node.host;
	}

	return null;

}

export function getComposedPreviousAncestorElementSibling(node, { predicate } = {}) {
	let parentNode = getComposedParent(node);

	while (parentNode) {
		const previousParentSibling = getComposedPreviousElementSibling(parentNode, { predicate });
		if (previousParentSibling) return previousParentSibling;
		parentNode = getComposedParent(parentNode);
	}

	return null;
}

export function getComposedPreviousElementSibling(node, { predicate } = {}) {
	return getComposedElementSibling(node, { direction: 'previous', predicate });
}

// This method can be removed when cleaning up GAUD-10260-get-focusable-fix (double-check usage)
export function getNextAncestorSibling(node, predicate = () => true) {
	let parentNode = getComposedParent(node);

	while (parentNode) {
		const nextParentSibling = parentNode.nextElementSibling;
		if (nextParentSibling && predicate(nextParentSibling)) return nextParentSibling;
		parentNode = getComposedParent(parentNode);
	}

	return null;
}

// This method can be removed when cleaning up GAUD-10260-get-focusable-fix (double-check usage)
export function getPreviousAncestorSibling(node, predicate = () => true) {
	let parentNode = getComposedParent(node);

	while (parentNode) {
		const previousParentSibling = parentNode.previousElementSibling;
		if (previousParentSibling && predicate(previousParentSibling)) return previousParentSibling;
		parentNode = getComposedParent(parentNode);
	}

	return null;
}

export function getOffsetParent(node) {

	if (!window.ShadowRoot) {
		return node.offsetParent;
	}

	if (
		!getComposedParent(node) ||
		node.tagName === 'BODY' ||
		window.getComputedStyle(node).position === 'fixed'
	) {
		return null;
	}

	let firstTableElement = null;
	let currentNode = getComposedParent(node);
	while (currentNode) {
		if (currentNode instanceof ShadowRoot) {
			currentNode = getComposedParent(currentNode);
		} else if (currentNode instanceof DocumentFragment) {
			return firstTableElement;
		} else if (currentNode.tagName === 'BODY') {
			return firstTableElement || currentNode;
		}

		const position = window.getComputedStyle(currentNode).position;
		const tagName = currentNode.tagName;
		if (position && position !== 'static') {
			return currentNode;
		} else if (firstTableElement === null && position === 'static' && (tagName === 'TD' || tagName === 'TH' || tagName === 'TABLE')) {
			firstTableElement = currentNode;
		}
		currentNode = getComposedParent(currentNode);
	}

	return firstTableElement;

}

export function isComposedAncestor(ancestorNode, node) {
	return findComposedAncestor(node, (node) => {
		return (node === ancestorNode);
	}) !== null;
}

export function isVisible(node, { checkAncestors = true } = {}) {

	/* this helper is different from checking offsetParent because offsetParent
	returns null for fixed position elements regardless of visibility */

	if (!node) return false;

	if (!node.host) {
		if (node.style === undefined) return true;
		if (node.style.display === 'none') return false;
		if (node.style.visibility === 'hidden') return false;

		const computedStyle = window.getComputedStyle(node, null);
		if (computedStyle.getPropertyValue('display') === 'none') return false;
		if (computedStyle.getPropertyValue('visibility') === 'hidden') return false;
	}

	if (checkAncestors) {
		const parentNode = getComposedParent(node);
		if (parentNode) return isVisible(parentNode);
	}

	return true;

}

export function getFirstVisibleAncestor(node) {
	let hiddenAncestor = findComposedAncestor(node, n => !isVisible(n, { checkAncestors: false }));
	while (hiddenAncestor) {
		node = getComposedParent(hiddenAncestor);
		hiddenAncestor = findComposedAncestor(node, n => !isVisible(n, { checkAncestors: false }));
	}
	return node;
}

export function querySelectorComposed(node, selector) {

	if (!node || (node.nodeType !== Node.ELEMENT_NODE && node.nodeType !== Node.DOCUMENT_NODE && node.nodeType !== Node.DOCUMENT_FRAGMENT_NODE)) {
		throw new TypeError('Invalid node. Must be nodeType document, element or document fragment');
	}
	if (typeof selector !== 'string') {
		throw new TypeError('Invalid selector');
	}

	const elem = node.querySelector(selector);
	if (elem) return elem;

	const allElems = node.querySelectorAll('*');
	for (const elem of allElems) {
		if (elem.shadowRoot) {
			const nestedElem = querySelectorComposed(elem.shadowRoot, selector);
			if (nestedElem) return nestedElem;
		}
	}

	return null;
}

const resizeNoopEventListener = new Set();
const resizeNoopRect = {};

if (globalThis.addEventListener) {
	globalThis.addEventListener('resize', e => {
		if (resizeNoopEventListener.size === 0) return;

		const frameElement = e.target.frameElement;
		if (frameElement?.classList.contains('d2l-iframe-fit-user-content')) {
			// ignore if the iframe is spamming no-op resize events
			if (resizeNoopRect.height === frameElement.scrollHeight && resizeNoopRect.width === frameElement.scrollWidth) {
				return;
			}
			resizeNoopRect.height = frameElement.scrollHeight;
			resizeNoopRect.width = frameElement.scrollWidth;
		}

		resizeNoopEventListener.forEach(listener => {
			listener(e);
		});
	});
}

export function addResizeNoopEventListener(listener) {
	resizeNoopEventListener.add(listener);
	resizeNoopRect.height = null;
	resizeNoopRect.width = null;
}

export function removeResizeNoopEventListener(listener) {
	resizeNoopEventListener.delete(listener);
}

// testing only
export function clearResizeNoopEventListeners() {
	resizeNoopEventListener.clear();
}
