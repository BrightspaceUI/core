export function findComposedAncestor(node, predicate) {
	while (node) {
		if (predicate(node) === true) {
			return node;
		}
		node = getComposedParent(node);
	}
	return null;
}

export function getComposedChildren(node) {

	if (!node) {
		return null;
	}
	if (node.nodeType !== 1 && node.nodeType !== 9 && node.nodeType !== 11) {
		return null;
	}

	let nodes;
	const children = [];

	if (node.tagName === 'CONTENT') {
		nodes = node.getDistributedNodes();
	} else if (node.tagName === 'SLOT') {
		nodes = node.assignedNodes({flatten: true});
	} else {
		if (node.shadowRoot) {
			node = node.shadowRoot;
		}
		nodes = node.children || node.childNodes;
	}

	for (let i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType === 1) {
			children.push(nodes[i]);
		}
	}

	return children;

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

	let currentNode = getComposedParent(node);
	while (currentNode) {
		if (currentNode instanceof ShadowRoot) {
			currentNode = getComposedParent(currentNode);
		} else if (currentNode instanceof DocumentFragment) {
			return null;
		} else if (currentNode.tagName === 'BODY') {
			return currentNode;
		}

		const position = window.getComputedStyle(currentNode).position;
		const tagName = currentNode.tagName;
		if (
			(position && position !== 'static') ||
			position === 'static' && (tagName === 'TD' || tagName === 'TH' || tagName === 'TABLE')
		) {
			return currentNode;
		}
		currentNode = getComposedParent(currentNode);
	}

	return null;

}

export function isComposedAncestor(ancestorNode, node) {
	return findComposedAncestor(node, (node) => {
		return (node === ancestorNode);
	}) !== null;
}
