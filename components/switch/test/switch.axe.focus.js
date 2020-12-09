import '../switch.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-switch', () => {

	it('focused', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});
