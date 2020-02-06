import '../meter-radial.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-meter-radial', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests (no progress)', async() => {
			const elem = await fixture(html`<d2l-meter-radial value="0" max="10"></d2l-meter-radial>`);
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (has progress)', async() => {
			const elem = await fixture(html`<d2l-meter-radial value="3" max="10"></d2l-meter-radial>`);
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (completed)', async() => {
			const elem = await fixture(html`<d2l-meter-radial value="10" max="10"></d2l-meter-radial>`);
			await expect(elem).to.be.accessible();
		});

	});

});
