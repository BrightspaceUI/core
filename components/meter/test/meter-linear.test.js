import '../meter-linear.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-meter-linear', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests (no progress)', async() => {
			const elem = await fixture(html`<d2l-meter-linear value="0" max="10"></d2l-meter-linear>`);
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (has progress)', async() => {
			const elem = await fixture(html`<d2l-meter-linear value="3" max="10"></d2l-meter-linear>`);
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (completed)', async() => {
			const elem = await fixture(html`<d2l-meter-linear value="10" max="10"></d2l-meter-linear>`);
			await expect(elem).to.be.accessible();
		});

	});

});
