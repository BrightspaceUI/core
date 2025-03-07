import '../meter-linear.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-meter-linear', () => {

	it('no progress', async() => {
		const elem = await fixture(html`<d2l-meter-linear value="0" max="10"></d2l-meter-linear>`);
		await expect(elem).to.be.accessible();
	});

	it('has progress', async() => {
		const elem = await fixture(html`<d2l-meter-linear value="3" max="10"></d2l-meter-linear>`);
		await expect(elem).to.be.accessible();
	});

	it('completed', async() => {
		const elem = await fixture(html`<d2l-meter-linear value="10" max="10"></d2l-meter-linear>`);
		await expect(elem).to.be.accessible();
	});

	it('text', async() => {
		const elem = await fixture(html`<d2l-meter-linear value="10" max="10" text="Completed"></d2l-meter-linear>`);
		await expect(elem).to.be.accessible();
	});

	it('text hidden', async() => {
		const elem = await fixture(html`<d2l-meter-linear value="10" max="10" text="Completed" text-hidden></d2l-meter-linear>`);
		expect(elem.shadowRoot.querySelector('div').getAttribute('aria-label')).to.equal('Completed, 10 out of 10, Progress Indicator');
		await expect(elem).to.be.accessible();
	});

	it('text hidden with replacements', async() => {
		const elem = await fixture(html`<d2l-meter-linear value="3" max="6" text="Visited: {x/y}" percent text-hidden></d2l-meter-linear>`);
		expect(elem.shadowRoot.querySelector('div').getAttribute('aria-label')).to.equal('Visited: 3 out of 6, 50 %, Progress Indicator');
		await expect(elem).to.be.accessible();
	});

});
