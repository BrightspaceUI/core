import '../card.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-card', () => {

	it('should construct', () => {
		runConstructor('d2l-card');
	});

	it('should not set href attribute if null', async() => {
		const elem = await fixture(html`<d2l-card></d2l-card>`);
		elem.href = null;
		await elem.updateComplete;
		const anchorElem = elem.shadowRoot.querySelector('a');
		expect(anchorElem).to.be.null;
	});

});
