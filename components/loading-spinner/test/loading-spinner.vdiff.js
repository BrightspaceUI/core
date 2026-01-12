import '../loading-spinner.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-loading-spinner', () => {
	[false, true].forEach((end) => {
		describe(end ? 'end' : 'start', () => {
			let elem, slices;
			beforeEach(async() => {
				elem = await fixture(html`<d2l-loading-spinner></d2l-loading-spinner>`);
				slices = elem.shadowRoot.querySelectorAll('.d2l-loading-spinner-slice');
				for (const slice of slices) {
					slice.style.animation = 'none';
					if (end) slice.style.display = 'none';
				}
			});

			it('default', async() => {
				await expect(elem).to.be.golden();
			});

			it('custom size', async() => {
				elem.size = 100;
				await elem.updateComplete;
				await expect(elem).to.be.golden();
			});

			it('custom color', async() => {
				elem.color = 'red';
				await elem.updateComplete;
				await expect(elem).to.be.golden();
			});
		});
	});
});
