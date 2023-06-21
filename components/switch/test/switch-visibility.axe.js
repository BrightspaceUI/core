import '../switch-visibility.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-switch-visibility', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-switch-visibility></d2l-switch-visibility>`);
		await expect(elem).to.be.accessible();
	});

	it('is on and has conditions', async() => {
		const elem = await fixture(html`<d2l-switch-visibility on>Conditions</d2l-switch-visibility>`);
		await expect(elem).to.be.accessible();
	});

});
