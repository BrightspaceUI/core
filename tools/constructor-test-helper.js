import { expect } from '@open-wc/testing';

export function runConstructor(nodeName) {
	const ctor = customElements.get(nodeName);
	expect(ctor).to.not.be.undefined;
	document.createElement(nodeName);
}
