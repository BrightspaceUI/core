import '../skip-nav-main.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-skip-nav-main', () => {

	describe('accessibility', () => {
		it('should pass all aXe tests', async() => {
			const el = await fixture(html`<d2l-skip-nav-main></d2l-skip-nav-main>`);
			await expect(el).to.be.accessible();
		});
	});;
});
