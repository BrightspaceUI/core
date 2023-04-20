/**
 * Adapted from:
 * 	https://github.com/josepharhar/offsetparent-polyfills
 *
 * More discussion:
 * 	https://bugs.chromium.org/p/chromium/issues/detail?id=1331803
 * 	https://github.com/mjfroman/moz-libwebrtc-third-party/commit/047e8804fc9d871825c1005413610e934f0116d9
 * 	https://github.com/WICG/webcomponents/issues/497
 */

const originalOffsetParent = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent').get;
const originalOffsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop').get;
const originalOffsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft').get;

function flatTreeParent(element) {
	if (element.assignedSlot) {
		return element.assignedSlot;
	}
	if (element.parentNode instanceof ShadowRoot) {
		return element.parentNode.host;
	}
	return element.parentNode;
}

function ancestorTreeScopes(element) {
	const scopes = new Set();
	let currentScope = element.getRootNode();
	while (currentScope) {
		scopes.add(currentScope);
		currentScope = currentScope.parentNode
			? currentScope.parentNode.getRootNode()
			: null;
	}
	return scopes;
}

function offsetParentPolyfill(element, isNewBehavior) {
	// Do an initial walk to check for display:none ancestors.
	for (let ancestor = element; ancestor; ancestor = flatTreeParent(ancestor)) {
		if (!(ancestor instanceof Element))
			continue;
		if (getComputedStyle(ancestor).display === 'none')
			return null;
	}

	let scopes = null;
	if (isNewBehavior)
		scopes = ancestorTreeScopes(element);

	for (let ancestor = flatTreeParent(element); ancestor; ancestor = flatTreeParent(ancestor)) {
		if (!(ancestor instanceof Element))
			continue;
		const style = getComputedStyle(ancestor);
		// display:contents nodes aren't in the layout tree so they should be skipped.
		if (style.display === 'contents')
			continue;
		if (style.position !== 'static') {
			if (isNewBehavior) {
				if (scopes.has(ancestor.getRootNode())) {
					return ancestor;
				}
			} else {
				return ancestor;
			}
		}
		if (ancestor.tagName === 'BODY')
			return ancestor;
	}
	return null;
}

let isOffsetParentPatchedCached = null;
function isOffsetParentPatched() {
	if (isOffsetParentPatchedCached !== null) {
		return isOffsetParentPatchedCached;
	}

	const container = document.createElement('div');
	container.style.position = 'absolute';
	const shadowroot = container.attachShadow({ mode: 'open' });
	document.body.appendChild(container);

	const lightChild = document.createElement('div');
	container.appendChild(lightChild);

	const shadowChild = document.createElement('div');
	shadowChild.style.position = 'absolute';
	shadowChild.appendChild(document.createElement('slot'));
	shadowroot.appendChild(shadowChild);

	const originalValue = originalOffsetParent.apply(lightChild);
	if (originalValue === container) {
		isOffsetParentPatchedCached = true;
	} else if (originalValue === shadowChild) {
		isOffsetParentPatchedCached = false;
	} else {
		console.error('what ', originalValue);
	}

	container.remove();
	return isOffsetParentPatchedCached;
}

function offsetTopLeftPolyfill(element, originalFn) {
	if (!isOffsetParentPatched())
		return originalFn.apply(element);

	let value = originalFn.apply(element);
	let nextOffsetParent = offsetParentPolyfill(element, /*isNewBehavior=*/false);
	const scopes = ancestorTreeScopes(element);

	while (!scopes.has(nextOffsetParent.getRootNode())) {
		value -= originalFn.apply(nextOffsetParent);
		nextOffsetParent = offsetParentPolyfill(nextOffsetParent, /*isNewBehavior=*/false);
	}

	return value;
}

export function getLegacyOffsetParent(element) {
	return offsetParentPolyfill(element, /*isNewBehavior=*/false);
}

export function getLegacyOffsetTop(element) {
	return offsetTopLeftPolyfill(element, originalOffsetTop);
}

export function getLegacyOffsetLeft(element) {
	return offsetTopLeftPolyfill(element, originalOffsetLeft);
}
