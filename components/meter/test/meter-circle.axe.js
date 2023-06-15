import '../meter-circle.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-meter-circle', () => {

	it('no progress', async() => {
		const elem = await fixture(html`<d2l-meter-circle value="0" max="10"></d2l-meter-circle>`);
		await expect(elem).to.be.accessible();
	});

	it('has progress', async() => {
		const elem = await fixture(html`<d2l-meter-circle value="3" max="10"></d2l-meter-circle>`);
		await expect(elem).to.be.accessible();
	});

	it('completed', async() => {
		const elem = await fixture(html`<d2l-meter-circle value="10" max="10"></d2l-meter-circle>`);
		await expect(elem).to.be.accessible();
	});

});
