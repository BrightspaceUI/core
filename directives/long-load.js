import { directive, NodePart } from 'lit-html/lit-html.js';

const nestedPartMap = new WeakMap();

/**
 * https://lit-html.polymer-project.org/guide/creating-directives
 */
export const longLoad = directive((value) => (containerPart) => {
	if (!(containerPart instanceof NodePart)) {
		throw new DirectiveError('longLoad directive can only be used in content bindings');
	}

	let part, copy;
	const nestedParts = nestedPartMap.get(containerPart);
	if (nestedParts === undefined) {
		// duplicate item
		part = createAndAppend(part);
		copy = createAndAppend(part);
		nestedPartMap.set(containerPart, [part, copy]);
	} else {
		[ part, copy ] = nestedParts;
	}

	// insert it into the part, offescreen
	part.setValue(value);
	part.commit();
	copy.setValue(value);
	copy.commit();
});

function createAndAppend(containerPart) {
	const newPart = new NodePart(containerPart.options);
	newPart.appendIntoPart(containerPart);

	return newPart;
}

class DirectiveError extends Error {
	constructor(message) {
		super(message);
		this.name = 'DirectiveError';
	}
}
