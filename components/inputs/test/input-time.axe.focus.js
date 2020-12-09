import '../input-time.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-input-time', () => {

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-time label="label text" time-interval="sixty"></d2l-input-time>`);
		setTimeout(() => elem.shadowRoot.querySelector('.d2l-input').focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});
