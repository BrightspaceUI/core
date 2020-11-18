import '../input-checkbox.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-input-checkbox', () => {

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-checkbox aria-label="basic"></d2l-input-checkbox>`);
		setTimeout(() => elem.shadowRoot.querySelector('input.d2l-input-checkbox').focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});
