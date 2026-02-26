import '../backdrop-loading.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const template = html`
	<div style="position:relative">
		<div style="background-color: orange; height: 200px; padding: 1rem;">
			Stuff in here
		</div>
		<d2l-backdrop-loading></d2l-backdrop-loading>
	</div>
`;

describe('backdrop-loading', () => {
	it('not shown', async() => {
		const elem = await fixture(template);
		await expect(elem).to.be.golden();
	});

	it('shown', async() => {
		const elem = await fixture(template);
		elem.querySelector('d2l-backdrop-loading').shown = true;
		await expect(elem).to.be.golden();
	});
});
