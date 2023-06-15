import { expect } from '@brightspace-ui/testing';

export function runConstructor(nodeName) {
	const ctor = customElements.get(nodeName);
	expect(ctor).to.not.be.undefined;
	document.createElement(nodeName);
}
