import { getComposedParent } from './dom.js';

function getComposedPath(elem, opts) {

	if (!opts?.composedPath) return '';

	const composedParents = [];
	let parent = elem;
	while (parent !== null && parent?.tagName?.toLowerCase() !== 'body') {
		if (parent?.tagName) {
			composedParents.push(parent.tagName.toLowerCase());
		}
		parent = getComposedParent(parent);
	}

	if (composedParents.length === 0) return '';

	composedParents.reverse();
	const path = ` Path: "${composedParents.join(' > ')}".`;
	return path;

}

export function createElementErrorMessage(type, elem, message, opts) {
	const path = getComposedPath(elem, opts);
	return `<${elem.tagName.toLowerCase()}>: ${message}.${path} (@brightspace-ui/core:${type})`;
}
