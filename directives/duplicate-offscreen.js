import { directive, NodePart } from 'lit-html/lit-html.js';
import { offscreenStyles } from '../components/offscreen/offscreen.js';

const nestedPartMap = new WeakMap();

/**
 * Duplicates a node and renders it off-screen
 *
 * This is an alteration of the 'duplicate'
 * directive provided in the lit-html documentation.
 * https://lit-html.polymer-project.org/guide/creating-directives
 */
export const duplicateOffscreen = directive((value) => (containerPart) => {
	if (!(containerPart instanceof NodePart)) {
		throw new DirectiveError('duplicateOffscreen directive can only be used in content bindings');
	}

	let part, copy;
	const nestedParts = nestedPartMap.get(containerPart);
	if (nestedParts === undefined) {
		// duplicate item
		part = createAndAppend(containerPart);
		copy = createAndAppend(containerPart);
		nestedPartMap.set(containerPart, [part, copy]);
	} else {
		[ part, copy ] = nestedParts;
	}

	// set the part
	part.setValue(value);
	part.commit();

	// set the copy
	copy.setValue(value);
	copy.commit();

	// nextSibling is how we access the actual node we need
	// This is hardly intuitive and requires knowledge of Part's inner workings
	// https://github.com/Polymer/lit-html/issues/388
	const copyNode = copy.startNode.nextSibling;
	copyNode.setAttribute('data-duplicate', '');
	copyNode.setAttribute('aria-hidden', 'true');
	copyNode.classList.add('d2l-offscreen');

	// create and insert a style tag manually on the shadowRoot
	// Doing this is actually efficient, as browsers automatically deduplicate
	// multiple instances of the same style sheet
	// https://lit-html.polymer-project.org/guide/styling-templates#rendering-in-shadow-dom
	const shadow = containerPart.options.eventContext.shadowRoot;
	const style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(offscreenStyles));
	shadow.prepend(style);
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
