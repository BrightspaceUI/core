import '../meter-radial.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-meter-radial', () => {

	it('no progress', async() => {
		const elem = await fixture(html`<d2l-meter-radial value="0" max="10"></d2l-meter-radial>`);
		await expect(elem).to.be.accessible();
	});

	it('has progress', async() => {
		const elem = await fixture(html`<d2l-meter-radial value="3" max="10"></d2l-meter-radial>`);
		await expect(elem).to.be.accessible();
	});

	it('completed', async() => {
		const elem = await fixture(html`<d2l-meter-radial value="10" max="10"></d2l-meter-radial>`);
		await expect(elem).to.be.accessible();
	});

	it('text', async() => {
		const elem = await fixture(html`<d2l-meter-radial value="10" max="10" text="Completed"></d2l-meter-radial>`);
		await expect(elem).to.be.accessible();
	});

	it('text hidden', async() => {
		const elem = await fixture(html`<d2l-meter-radial value="10" max="10" text="Completed" text-hidden></d2l-meter-radial>`);
		await expect(elem).to.be.accessible();
	});

});
