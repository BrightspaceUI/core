import '../switch-visibility.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-switch-visibility', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-switch-visibility></d2l-switch-visibility>`);
		await expect(elem).to.be.accessible;
	});

});
