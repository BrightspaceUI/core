
import '../input-date.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-input-date', () => {

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-date label="label text"></d2l-input-date>`);
		setTimeout(() => elem.shadowRoot.querySelector('d2l-input-text').focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});
