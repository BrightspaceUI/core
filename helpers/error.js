import { getComposedParent } from './dom.js';

const numParentLevels = 10;

function getComposedPath(elem, opts) {

	if (!opts?.composedPath) return '';

	const composedParents = [];
	let parent = getComposedParent(elem);
	while (parent !== null && parent?.tagName?.toLowerCase() !== 'body') {
		if (parent?.tagName) {
			composedParents.push(parent.tagName.toLowerCase());
		}
		parent = getComposedParent(parent);
	}

	if (composedParents.length === 0) return '';

	const slicedParents = composedParents.slice(0, numParentLevels);
	const path = ` ${slicedParents.length} parent nodes: "${slicedParents.join(', ')}".`;
	return path;

}

export function createElementErrorMessage(type, elem, message, opts) {
	const path = getComposedPath(elem, opts);
	return `<${elem.tagName.toLowerCase()}>: ${message}.${path} (@brightspace-ui/core:${type})`;
}
