import { getComposedChildren, getComposedParent, getNextAncestorSibling, getPreviousAncestorSibling, isVisible } from './dom.js';

const focusableElements = {
	a: true,
	body: true,
	button: true,
	frame: true,
	iframe: true,
	input: true,
	isindex: true,
	object: true,
	select: true,
	textarea: true
};

export function getComposedActiveElement() {
	let node = document.activeElement;

	if (!node) return null;
	while (node.shadowRoot) {
		if (node.shadowRoot.activeElement) node = node.shadowRoot.activeElement;
		else break;
	}

	return node;
}

export function getFirstFocusableDescendant(node, includeHidden, predicate, includeTabbablesOnly) {
	if (predicate === undefined) predicate = () => true;

	const composedChildren = getComposedChildren(node);

	for (let i = 0; i < composedChildren.length; i++) {
		if (isFocusable(composedChildren[i], includeHidden, includeTabbablesOnly) && predicate(composedChildren[i])) return composedChildren[i];

		const focusable = getFirstFocusableDescendant(composedChildren[i], includeHidden, predicate, includeTabbablesOnly);
		if (focusable) return focusable;
	}

	return null;
}

export function getFocusPseudoClass() {
	return isFocusVisibleSupported() ? 'focus-visible' : 'focus';
}

export function getLastFocusableDescendant(node, includeHidden) {
	const composedChildren = getComposedChildren(node);

	for (let i = composedChildren.length - 1; i >= 0; i--) {
		const focusable = getLastFocusableDescendant(composedChildren[i], includeHidden);
		if (focusable) return focusable;

		if (isFocusable(composedChildren[i], includeHidden)) return composedChildren[i];
	}

	return null;
}

export function getPreviousFocusable(node, includeHidden) {
	if (!node) return null;

	if (includeHidden === undefined) includeHidden = false;

	const _getPreviousFocusable = (node, ignore, ignoreChildren) => {
		if (!ignore && isFocusable(node, includeHidden)) return node;

		if (!ignoreChildren) {
			const focusable = getLastFocusableDescendant(node, includeHidden);
			if (focusable) return focusable;
		}

		const previousSibling = node.previousElementSibling;
		if (previousSibling) {
			const siblingFocusable = _getPreviousFocusable(previousSibling, false, false);
			if (siblingFocusable) return siblingFocusable;
			return null;
		}

		const previousAncestorSibling = getPreviousAncestorSibling(node);
		if (previousAncestorSibling) {
			const parentSibingFocusable = _getPreviousFocusable(previousAncestorSibling, false, false);
			if (parentSibingFocusable) return parentSibingFocusable;
		}

		return null;
	};

	const focusable = _getPreviousFocusable(node, true, true);
	return focusable;
}

export function getNextFocusable(node, includeHidden, ignore, ignoreChildren) {

	if (!node) return null;

	if (includeHidden === undefined) includeHidden = false;
	if (ignore === undefined) ignore = true;
	if (ignoreChildren === undefined) ignoreChildren = false;

	const _getNextFocusable = (node, ignore, ignoreChildren) => {
		if (!ignore && isFocusable(node, includeHidden)) return node;

		if (!ignoreChildren) {
			const focusable = getFirstFocusableDescendant(node, includeHidden);
			if (focusable) return focusable;
		}

		const nextSibling = node.nextElementSibling;
		if (nextSibling) {
			const siblingFocusable = _getNextFocusable(nextSibling, false, false);
			if (siblingFocusable) return siblingFocusable;
			return null;
		}

		const nextParentSibling = getNextAncestorSibling(node);
		if (nextParentSibling) {
			const parentSibingFocusable = _getNextFocusable(nextParentSibling, false, false);
			if (parentSibingFocusable) return parentSibingFocusable;
		}

		return null;
	};

	const focusable = _getNextFocusable(node, ignore, ignoreChildren);
	return focusable;

}

export function getPreviousFocusableAncestor(node, includeHidden, includeTabbablesOnly) {
	if (!node) return null;

	if (includeHidden === undefined) includeHidden = false;

	if (includeTabbablesOnly === undefined) includeTabbablesOnly = true;

	let parentNode = getComposedParent(node);
	while (parentNode) {
		if (isFocusable(parentNode, includeHidden, includeTabbablesOnly)) return parentNode;
		parentNode = getComposedParent(parentNode);
	}

	return null;
}

export function isFocusable(node, includeHidden, includeTabbablesOnly, includeDisabled) {

	if (!node || node.nodeType !== 1 || (!includeDisabled && node.disabled)) return false;

	if (includeTabbablesOnly === undefined) includeTabbablesOnly = true;

	let _isFocusable;
	const _minTabIndex = includeTabbablesOnly ? 0 : -1;

	// IE treats all nodes without tabindex explicitly set as having tabindex=0
	if (node.getAttributeNode) {
		const tabIndexAttr = node.getAttributeNode('tabindex');
		if (tabIndexAttr && tabIndexAttr.specified) {
			_isFocusable = (tabIndexAttr.value >= _minTabIndex);
		}
	}

	const nodeName = node.nodeName.toLowerCase();
	if (_isFocusable === undefined) {
		_isFocusable = focusableElements[nodeName];
	}

	if (_isFocusable && !includeHidden) {
		// only perform visibility check if absolutely necessary
		if (nodeName !== 'body' && !isVisible(node)) return false;
	}

	return _isFocusable;

}

let _isFocusVisibleSupported;

export function isFocusVisibleSupported() {
	if (_isFocusVisibleSupported === undefined) {
		const style = document.createElement('style');
		try {
			document.head.appendChild(style);
			style.sheet.insertRule(':focus-visible { color: inherit; }');
			_isFocusVisibleSupported = true;
		} catch (error) {
			_isFocusVisibleSupported = false;
		} finally {
			style.remove();
		}
	}

	return _isFocusVisibleSupported;
}
