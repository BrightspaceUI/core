import '../skip-nav-custom.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const customFixture = html`<d2l-skip-nav-custom text="Skip to custom place"></d2l-skip-nav-custom>`;

describe('d2l-skip-nav-custom', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests', async() => {
			const elem = await fixture(customFixture);
			await focusElem(elem);
			await expect(elem).to.be.accessible();
		});

	});

});
